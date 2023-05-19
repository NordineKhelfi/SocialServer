import { deleteFiles, uploadFiles } from "../../../providers";
import { UPLOAD_POST_IMAGES_DIR, UPLOAD_POST_THUMBNAILS_DIR, UPLOAD_POST_VIDEOS_DIR } from "../../../config";
import { GraphQLUpload } from "graphql-upload";
import { ApolloError } from "apollo-server-express";
import { PostValidator } from "../../../validators/post";
import { Op } from "sequelize";
import { isValidHashTag } from "./hashtag";

export default {
    Upload: GraphQLUpload,
    Query: {

        getUserPosts: async (_, { userId, postType, offset, limit }, { db, user }) => {
            try {

                // check if the user exists 
                const profile = await db.User.findByPk(userId, {
                    include: [
                        {
                            model: db.Media,
                            as: "profilePicture"
                        }
                    ]
                });
                if (profile == null)
                    throw new Error("User not found !");

                // get all the posts that belongs to the given user 
                var posts = await profile.getPosts({
                    include: [
                        {
                            model: db.Media,
                            as: "media"
                        },
                        {
                            model: db.Reel,
                            as: "reel",
                            include: [{
                                model: db.Media,
                                as: "thumbnail"
                            }]
                        }, {

                            model  : db.HashTag , 
                            as : "hashtags"
                        }

                    ],
                    where: {
                        type: postType
                    },
                    order: [["id", "DESC"]],
                    offset: offset,
                    limit: limit
                });

                // asign the profile to the user attribute 
                // check if this posts liked by the requesting user or not 
                for (let index = 0; index < posts.length; index++) {
                    posts[index].user = profile;
                    if (user) {
                        posts[index].liked = (await user.getLikes({
                            where: {
                                postId: posts[index].id
                            }
                        })).length > 0;

                        posts[index].isFavorite = (await user.getFavorites({
                            where: {
                                postId: posts[index].id
                            }
                        })).length > 0;
                    }
                    else {
                        post[index].liked = false;
                        post[index].isFavorite = false;

                    }

                }


                return posts


            } catch (error) {
                return new ApolloError(error.message);
            }
        },
        getPosts: async (_, { time, limit }, { db, user }) => {
            try {
                if (!time)
                    time = new Date().toISOString();
                else
                    time = new Date(parseInt(time)).toISOString();

                var posts = await db.Post.findAll({

                    include: [{
                        model: db.User,
                        as: "user",
                        include: [{
                            model: db.Media,
                            as: "profilePicture"
                        }]
                    }, {
                        model: db.Media,
                        as: "media"
                    }, {

                        model  : db.HashTag , 
                        as : "hashtags"
                    }],
                    where: {
                        type: {
                            [Op.not]: "reel"
                        },
                        createdAt: {
                            [Op.lt]: time
                        }
                    },
                    order: [["createdAt", "DESC"]],

                    limit
                });
                // if the user logged in check if he allready liked on of this posts 
                if (user) {
                    for (let index = 0; index < posts.length; index++) {
                        posts[index].liked = (await user.getLikes({
                            where: {
                                postId: posts[index].id
                            }
                        })).length > 0;

                        posts[index].isFavorite = (await user.getFavorites({
                            where: {
                                postId: posts[index].id
                            }
                        })).length > 0;
                    }
                }
                else {
                    for (let index = 0; index < posts.length; index++) {
                        posts[index].liked = false;
                        posts[index].isFavorite = false;
                    }
                }
                return posts;

            } catch (error) {
                return new ApolloError(error.message)
            }
        },
        getPostById: async (_, { postId }, { db, user }) => {
            try {

                var post = await db.Post.findOne({
                    include: [{
                        model: db.User,
                        as: "user",
                        include: [{
                            model: db.Media,
                            as: "profilePicture"
                        }]
                    }, {
                        model: db.Media,
                        as: "media"
                    }, {

                        model: db.Reel,
                        as: "reel",
                        include: [{
                            model: db.Media,
                            as: "thumbnail"
                        }]

                    }],
                    where: {
                        id: postId
                    }
                });


                if (post && user) {

                    post.liked = (await user.getLikes({
                        where: {
                            postId: post.id
                        }
                    })).length > 0;

                    post.isFavorite = (await user.getFavorites({
                        where: {
                            postId: post.id
                        }
                    })).length > 0;

                } else if (post) {

                    post.liked = false;
                    post.isFavorite = false;


                }

                return post;
            } catch (error) {
                return new ApolloError(error.message);
            }
        },
        getFavorites: async (_, { offset, limit }, { db, user }) => {
            try {

                var favorites = await user.getFavorites({
                    include: [{
                        model: db.Post,
                        as: "post",
                        include: [{
                            model: db.User,
                            as: "user",
                            include: [{
                                model: db.Media,
                                as: "profilePicture"
                            }]
                        }, {
                            model: db.Media,
                            as: "media"
                        }, {

                            model: db.Reel,
                            as: "reel",
                            include: [{
                                model: db.Media,
                                as: "thumbnail"
                            }]

                        }],
                    }],


                    order: [["createdAt", "DESC"]],
                    offset: offset,
                    limit: limit
                });

                var posts = favorites.map(favorite => favorite.post);


                for (let index = 0; index < posts.length; index++) {
                    posts[index].liked = (await user.getLikes({
                        where: {
                            postId: posts[index].id
                        }
                    })).length > 0;

                    posts[index].isFavorite = true;
                }
                return posts;
            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    },

    Mutation: {
        createPost: async (_, { postInput }, { db, user }) => {

            try {
                // vdaliate post input 
                await PostValidator.validate(postInput, { abortEarly: true });

                if (postInput.type == "reel" && !postInput.reel && !postInput.reel.thumbnail)
                    throw new Error("Thumbnail required for reels");

                // create the post and assign it to the given user 
                const post = await user.createPost(postInput);
                // if the post is media for upload the media and assign it to the post 

                var outputs = []; 
                var medium = [];
                
                // check if the content is image or reel 
                // uploda the content files and assign the paths to the outputs array 
                if (post.type == "image")
                    outputs = await uploadFiles(postInput.media, UPLOAD_POST_IMAGES_DIR);

                if (post.type == "reel") {

                    outputs = await uploadFiles(postInput.media, UPLOAD_POST_VIDEOS_DIR);
                    // upload thumbnail to the given directory 
                    // and associate it to the reel 
                    // and associate the reel to the post 
                    var thumbnail = (await uploadFiles([postInput.reel.thumbnail], UPLOAD_POST_THUMBNAILS_DIR)).pop();

                    if (thumbnail) {
                        const media = await db.Media.create({
                            path: thumbnail
                        });
                        const reel = await db.Reel.create({
                            thumbnailId: media.id,
                            postId: post.id,
                        });
                        reel.thumbnail = media;
                        post.reel = reel;
                    }
                }


                for (let index = 0; index < outputs.length; index++) {
                    // insert media into database 
                    // add it to the post 
                    const media = await db.Media.create({
                        path: outputs[index]
                    });

                    await post.addMedia(media);
                    medium.splice(0, 0, media);
                }

                var hashtags = [] ; 

                if ( postInput.hashtags && postInput.hashtags.length > 0) {
                    for (let index = 0 ; index < postInput.hashtags.length ; index ++) {
                        var hashtag = postInput.hashtags[index] ; 
                        if ( ! isValidHashTag(hashtag) ) {
                            continue ; 
                        } 

                        const hashtagExists = await db.HashTag.findOne({
                            where: {
                                name: {
                                    [Op.like]: hashtag
                                }
                            }
                        });
                        if (hashtagExists) { 
                            await post.addHashtag(hashtagExists) ; 
                            hashtags.push(hashtagExists) ; 
                            continue ; 
                        }

                        var newHashTag = await db.HashTag.create({ name: hashtag }) ; 
                        await post.addHashtag(newHashTag) ;  
                        hashtags.push(newHashTag) ; 
                        
                    } 
                }

                post.hashtags = hashtags ; 
                // assign all the uploaded media to the media attribute 
                post.media = medium;
                await user.update({
                    numPosts: user.numPosts + 1
                });

                return post;

            } catch (error) {

                return new ApolloError(error.message);
            }
        },
        deletePost: async (_, { postId }, { db, user }) => {
            try {
                // get the post by the given id and belongs to the given user 
                const post = await db.Post.findOne({
                    where: {
                        userId: user.id,
                        id: postId
                    },
                    include: [{
                        model: db.Media,
                        as: "media"
                    }]
                });
                // if the post do not exists return error
                if (post == null)
                    throw new Error("Post not found");

                // check if the post have media content 
                // delete it before removing the post from database 
                if (post.media) {

                    //await post.deleteMedia() ; 
                    post.media.forEach(async entry => {
                        await entry.destroy();
                    })
                    // delete the files from the storage 
                    await deleteFiles(post.media.map(file => file.path));

                }
                await post.destroy();
                return postId

            } catch (error) {
                return new ApolloError(error.message);
            }
        },
        like: async (_, { postId }, { db, user, sendPushNotification, pubSub }) => {

            try {
                // get the post and check if it's exists 
                const post = await db.Post.findByPk(postId, {
                    include: [{
                        model: db.Media,
                        as: "media",
                    }, {
                        model: db.Reel,
                        as: "reel",
                        include: [{
                            model: db.Media,
                            as: "thumbnail"
                        }]
                    }]
                });
                if (!post)
                    throw new Error("Post not found");

                // check if this post is allready likes or not 
                const likes = (await user.getLikes({
                    where: {
                        postId: postId
                    }
                })).pop();


                // if the post allready liked remove the likes 
                // and decreese the number of likes in the post 
                if (likes) {
                    await likes.destroy()
                    await post.update({ likes: post.likes - 1 })
                    return false;

                } else {
                    // else if this is the first like for this user to this post 
                    // thel add the post to thes like
                    // and increase the likes in the post  

                    var like = await db.Like.create({
                        userId: user.id,
                        postId: post.id
                    });

                    await post.update({ likes: post.likes + 1 });
                    user.profilePicture = await user.getProfilePicture();

                    like.createdAt = new Date();
                    like.user = user;
                    like.post = post;


                    if (user.id != post.userId) {
                        sendPushNotification(
                            await post.getUser(),
                            {
                                type: "post-like",
                                user: {
                                    name: user.name,
                                    lastname: user.lastname,
                                    profilePicture: user.profilePicture
                                },
                                post: {
                                    id: post.id,
                                    title: post.title,
                                    type: post.type,
                                    likes: post.likes,

                                }
                            }
                        )
                        pubSub.publish("NEW_LIKE", {
                            newLike: like
                        })
                    }
                    return true;
                }

            } catch (error) {
                return new ApolloError(error.message);
            }

        },

        favorite: async (_, { postId }, { db, user }) => {

            try {
                // get the post and check if it's exists 
                const post = await db.Post.findByPk(postId);
                if (!post)
                    throw new Error("Post not found");

                // check if this post is allready favorites or not 
                const favorites = (await user.getFavorites({
                    where: {
                        postId: postId
                    }
                })).pop();


                // if the post allready liked remove the favorites
                if (favorites) {
                    await favorites.destroy();
                    return false;

                } else {
                    // else if this is the first fav for this user to this post 
                    // then add the post to the favorites
                    await db.Favorite.create({
                        userId: user.id,
                        postId: post.id
                    })

                    return true;
                }

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}