import { deleteFiles, uploadFiles } from "../../../providers";
import { UPLOAD_POST_IMAGES_DIR, UPLOAD_POST_SERVICES_DIR, UPLOAD_POST_THUMBNAILS_DIR, UPLOAD_POST_VIDEOS_DIR, UPLOAD_POST_WORKS_DIR } from "../../../config";
import { GraphQLUpload } from "graphql-upload";
import { ApolloError } from "apollo-server-express";
import { PostValidator, ServiceValidator, WorkValidator } from "../../../validators/post";
import { Op, Sequelize } from "sequelize";
import hashtag, { isValidHashTag } from "./hashtag";

export default {
    Upload: GraphQLUpload,
    Query: {
        customerFilter: async (_, { }, { db, user }) => {
            try {
                return db.Post.findAll({
                    include: [{
                        model: db.User,
                        as: "user",
                        include: [{
                            model: db.Media,
                            as: "profilePicture"
                        }]
                    }, {
                        model: db.HashTag,
                        as: "hashtags" , 
                 
                    }, {
                        model : db.Media , 
                        as : "media" 
                    }], 
                    where : {
                        [Op.or] : [
                            Sequelize.where(Sequelize.col("hashtags.name")  ,  {
                                [Op.like] : "#vinkst" 
                            })
                        ] 
                    }
                });
            } catch (error) {
                console.log(error);
            }
        },

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

                var unImportantPosts = await user.getUnimportantPosts();
                unImportantPosts = unImportantPosts.map(post => post.id);
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
                            model: db.HashTag,
                            as: "hashtags"
                        }, {
                            model: db.Work,
                            as: "work",
                            include: [{
                                model: db.Category,
                                as: "category"
                            }]
                        }, {
                            model: db.Service,
                            as: "service",
                            include: [{
                                model: db.Category,
                                as: "category"
                            }]
                        }
                    ],
                    where: {
                        type: postType,
                        id: {
                            [Op.notIn]: unImportantPosts
                        }
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

        refresh: async (_, { time, limit }, { db, user }) => {
            try {
                time = new Date(parseInt(time)).toISOString();

                var blockedUsers = [];
                var followings = [];
                var unImportantPosts = [];

                if (user) {

                    blockedUsers = await db.BlockedUser.findAll({
                        where: {
                            [Op.or]: [
                                {
                                    blockedUserId: user.id
                                },
                                {
                                    userId: user.id
                                }
                            ]
                        }
                    });

                    blockedUsers = blockedUsers.map(blockedUser => {
                        return (blockedUser.userId == user.id) ? (blockedUser.blockedUserId) : (blockedUser.userId)
                    })

                    followings = await user.getFollowing();
                    followings = followings.map(follow => follow.followingId);
                    followings.push(user.id);

                    unImportantPosts = await user.getUnimportantPosts();
                    unImportantPosts = unImportantPosts.map(post => post.id);

                }



                var whereCase = {
                    userId: {
                        [Op.notIn]: blockedUsers
                    },
                    createdAt: {
                        [Op.gt]: time
                    },
                    id: {
                        [Op.notIn]: unImportantPosts
                    },
                    type: {
                        [Op.not]: "reel"
                    }
                }

                var posts = await db.Post.findAll({

                    include: [{
                        model: db.User,
                        as: "user",
                        required: true,
                        where: {
                            disabled: false,
                            [Op.or]: [
                                {
                                    id: {
                                        [Op.in]: followings
                                    }
                                },
                                {
                                    private: false
                                }
                            ]


                        },
                        include: [{
                            model: db.Media,
                            as: "profilePicture"
                        }]
                    }, {
                        model: db.Media,
                        as: "media"
                    }, {

                        model: db.HashTag,
                        as: "hashtags"
                    }, {
                        model: db.Reel,
                        as: "reel",
                        include: [{
                            model: db.Media,
                            as: "thumbnail"
                        }]
                    }],
                    where: whereCase,
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
                return new ApolloError(error.message);
            }
        },

        getPosts: async (_, { time, limit, includeReels }, { db, user }) => {
            try {
                if (!time)
                    time = new Date().toISOString();
                else
                    time = new Date(parseInt(time)).toISOString();

                var blockedUsers = [];
                var followings = [];
                var unImportantPosts = [];
                var postsInteractedWith = [];

                if (user) {
                    blockedUsers = await db.BlockedUser.findAll({
                        where: {
                            [Op.or]: [
                                {
                                    blockedUserId: user.id
                                },
                                {
                                    userId: user.id
                                }
                            ]
                        }
                    });

                    blockedUsers = blockedUsers.map(blockedUser => {
                        return (blockedUser.userId == user.id) ? (blockedUser.blockedUserId) : (blockedUser.userId)
                    })

                    followings = await user.getFollowing();
                    followings = followings.map(follow => follow.followingId);
                    followings.push(user.id);

                    unImportantPosts = await user.getUnimportantPosts();
                    unImportantPosts = unImportantPosts.map(post => post.id);

                    postsInteractedWith = await db.UserPostInteraction.findAll({
                        where: {
                            userId: user.id
                        }
                    });
                    postsInteractedWith = postsInteractedWith.map(x => x.postId);
                    unImportantPosts.push(...postsInteractedWith);
                }

                var whereCase = {
                    userId: {
                        [Op.notIn]: blockedUsers
                    },
                    createdAt: {
                        [Op.lt]: time
                    },
                    id: {
                        [Op.notIn]: unImportantPosts
                    }
                }


                if (!includeReels) {
                    whereCase.type = {
                        [Op.not]: "reel"
                    }
                };

                var posts = await db.Post.findAll({
                    include: [{
                        model: db.User,
                        as: "user",
                        required: true,
                        where: {
                            disabled: false,
                            [Op.or]: [
                                {
                                    id: {
                                        [Op.in]: followings
                                    }
                                },
                                {
                                    private: false
                                }
                            ]
                        },
                        include: [{
                            model: db.Media,
                            as: "profilePicture"
                        }]
                    }, {
                        model: db.Media,
                        as: "media"
                    }, {
                        model: db.HashTag,
                        as: "hashtags"
                    }, {
                        model: db.Reel,
                        as: "reel",
                        include: [{
                            model: db.Media,
                            as: "thumbnail"
                        }]
                    }, {
                        model: db.Work,
                        as: "work",
                        include: [{
                            model: db.Category,
                            as: "category"
                        }]
                    }],
                    where: whereCase,
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

                    }, {
                        model: db.Work,
                        as: "work",
                        include: [{
                            model: db.Category,
                            as: "category"
                        }]
                    }, {
                        model: db.Service,
                        as: "service",
                        include: [{
                            model: db.Category,
                            as: "category"
                        }]
                    }, {
                        model: db.Keyword,
                        as: "keywords",

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


            var unImportantPosts = await user.getUnimportantPosts();
            unImportantPosts = unImportantPosts.map(post => post.id);

            var followings = await user.getFollowing();
            followings = followings.map(follow => follow.followingId);
            followings.push(user.id);



            try {

                var favorites = await user.getFavorites({
                    include: [{
                        model: db.Post,
                        as: "post",
                        required: true,
                        include: [{
                            model: db.User,
                            as: "user",
                            required: true,
                            where: {
                                [Op.or]: [
                                    {
                                        id: {
                                            [Op.in]: followings
                                        }
                                    },
                                    {
                                        private: false
                                    }
                                ]
                            },
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
                    where: {
                        id: {
                            [Op.notIn]: unImportantPosts
                        }
                    },
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
                console.log(error.message);
                return new ApolloError(error.message);
            }
        },
        searchPost: async (_, { type, query, offset, limit }, { db, user }) => {
            try {

                var blockedUsers = await db.BlockedUser.findAll({
                    where: {
                        [Op.or]: [
                            {
                                blockedUserId: user.id
                            },
                            {
                                userId: user.id
                            }
                        ]
                    }
                });


                blockedUsers = blockedUsers.map(blockedUser => {
                    return (blockedUser.userId == user.id) ? (blockedUser.blockedUserId) : (blockedUser.userId)
                });


                var unImportantPosts = await user.getUnimportantPosts();
                unImportantPosts = unImportantPosts.map(post => post.id);


                var followings = await user.getFollowing();
                followings = followings.map(follow => follow.followingId);
                followings.push(user.id);

                var include = [{
                    model: db.User,
                    as: "user",
                    required: true,

                    where: {
                        id: {
                            [Op.notIn]: blockedUsers
                        },
                        disabled: false,
                        [Op.or]: [
                            {
                                id: {
                                    [Op.in]: followings
                                }
                            },
                            {
                                private: false
                            }
                        ]
                    },

                    include: [{
                        model: db.Media,
                        as: "profilePicture"
                    }]
                }, {
                    model: db.Media,
                    as: "media",
                }];


                if (type == "reel")
                    include.push({
                        model: db.Reel,
                        as: "reel",

                        include: [{
                            model: db.Media,
                            as: "thumbnail"
                        }]
                    })

                if (!query) {
                    query = "";
                }

                query = query.trim();

                var searchQuery = {
                    type: type,
                    id: {
                        [Op.notIn]: unImportantPosts
                    }
                };

                if (query) {
                    searchQuery = {
                        ...searchQuery,
                        [Op.or]: [
                            {
                                title: {
                                    [Op.like]: `%${query}%`
                                }
                            },
                            Sequelize.where(
                                Sequelize.fn("CONCAT", Sequelize.col("`user`.name"), " ", Sequelize.col("`user`.lastname")),
                                {
                                    [Op.like]: `%${query}%`
                                }
                            ),
                            Sequelize.where(
                                Sequelize.fn("CONCAT", Sequelize.col("`user`.lastname"), " ", Sequelize.col("`user`.name")),
                                {
                                    [Op.like]: `%${query}%`
                                }
                            ),
                            Sequelize.where(
                                Sequelize.col("`user`.username"), {
                                [Op.like]: `%${query}%`
                            }
                            )
                        ],
                    }
                }

                var posts = await db.Post.findAll({
                    subQuery: false,
                    include: include,
                    where: {
                        ...searchQuery
                    },
                    offset: offset,
                    limit: limit,
                    order: [["createdAt", "DESC"]]
                });

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

                return posts;


            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    },

    Mutation: {
        createPostTwo : async ( _ , {  postInput } , {db , user}) => { 
            try { 
                postInput.userId = user.id ; 
                postInput.service = postInput.serviceInput ; 

                postInput = db.Post.create( postInput , {
                    include : [{
                        model : db.HashTag , 
                        as : "hashtags" , 
                    } , { 
                        model : db.Service , 
                        as : "service" , 

                       
                    } , {
                        model : db.Keyword , 
                        as : "keywords"
                    } ]
                })  ; 


                return postInput ; 

            }catch( err ) { 
                return new ApolloError(err.message)
            }
        } , 

        createPost: async (_, { postInput }, { db, user }) => {
            try {
                await PostValidator.validate(postInput, { abortEarly: true });

                if (postInput.type == "reel" && !postInput.reel && !postInput.reel.thumbnail)
                    throw new Error("Thumbnail required for reels");

                var categoryId = null;
                var category = null;

                if (postInput.type == "work") {
                    await WorkValidator.validate(postInput.workInput, { abortEarly: true });
                    categoryId = postInput.workInput.categoryId;
                }

                if (postInput.type == "service") {
                    await ServiceValidator.validate(postInput.serviceInput, { abortEarly: true });
                    categoryId = postInput.serviceInput.categoryId;
                }

                if (categoryId) {
                    category = await db.Category.findByPk(categoryId);

                    if (!category)
                        throw new Error("Category not found");
                }

                // if the post is media for upload the media and assign it to the post 
                var outputs = [];
                var medium = [];
                var thumbnail = null;
                // check if the content is image or reel 
                // uploda the content files and assign the paths to the outputs array 
                if (postInput.type == "image")
                    outputs = await uploadFiles(postInput.media, UPLOAD_POST_IMAGES_DIR);

                if (postInput.type == "reel") {
                    outputs = await uploadFiles(postInput.media, UPLOAD_POST_VIDEOS_DIR);
                    // upload thumbnail to the given directory 
                    // and associate it to the reel 
                    // and associate the reel to the post 
                    thumbnail = (await uploadFiles([postInput.reel.thumbnail], UPLOAD_POST_THUMBNAILS_DIR)).pop();
                }

                if (postInput.type == "work") {
                    outputs = await uploadFiles(postInput.media, UPLOAD_POST_WORKS_DIR);
                }

                if (postInput.type == "service") {
                    outputs = await uploadFiles(postInput.media, UPLOAD_POST_SERVICES_DIR);
                }

                // create the post and assign it to the given user 
                const post = await user.createPost(postInput);

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

                for (let index = 0; index < outputs.length; index++) {
                    // insert media into database 
                    // add it to the post 
                    const media = await db.Media.create({
                        path: outputs[index]
                    });

                    await post.addMedia(media);
                    medium.splice(0, 0, media);
                }

                var hashtags = [];

                if (postInput.hashtags && postInput.hashtags.length > 0) {
                    for (let index = 0; index < postInput.hashtags.length; index++) {
                        var hashtag = postInput.hashtags[index];
                        if (!isValidHashTag(hashtag)) {
                            continue;
                        }

                        const hashtagExists = await db.HashTag.findOne({
                            where: {
                                name: {
                                    [Op.like]: hashtag
                                }
                            }
                        });
                        if (hashtagExists) {
                            await post.addHashtag(hashtagExists);
                            hashtags.push(hashtagExists);
                            continue;
                        }

                        var newHashTag = await db.HashTag.create({ name: hashtag });
                        await post.addHashtag(newHashTag);
                        hashtags.push(newHashTag);

                    }
                }

                var keywords = [];
                if (postInput.type == "work") {
                    keywords = postInput.workInput.keywords
                    postInput.workInput.postId = post.id;
                    const work = await db.Work.create(postInput.workInput);
                    console.log(category)
                    work.category = category;
                    post.work = work;
                }

                if (postInput.type == "service") {
                    keywords = postInput.serviceInput.keywords
                    postInput.serviceInput.postId = post.id;
                    const service = await db.Service.create(postInput.serviceInput);
                    service.category = category;
                    post.work = service;
                }

                for (var index = 0; index < keywords.length; index++) {
                    var keyword = keywords[index];

                    const keywordExists = await db.Keyword.findOne({
                        where: {
                            name: keyword
                        }
                    });

                    if (keywordExists) {
                        await post.addKeyword(keywordExists);
                        keywords[index] = keywordExists;
                        continue;
                    }

                    var newKyeword = await db.Keyword.create({ name: keyword });
                    await post.addKeyword(newKyeword);
                    keywords[index] = newKyeword;
                }

                post.hashtags = hashtags;
                post.keywords = keywords;

                // assign all the uploaded media to the media attribute 
                post.media = medium;
                await user.update({
                    numPosts: user.numPosts + 1
                });
                return post;

            } catch (error) {
                console.log(error);
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
                    }, {
                        model: db.Reel,
                        as: "reel",

                        include: [{
                            model: db.Media,
                            as: "thumbnail"
                        }]
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

                if (post.reel && post.reel.thumbnail) {
                    await post.reel.thumbnail.destroy();
                    await deleteFiles([post.reel.thumbnail.path]);
                }


                await user.update({
                    numPosts: user.numPosts - 1
                });


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

                const blockedUser = await db.BlockedUser.findOne({
                    where: {
                        [Op.or]: [
                            {
                                userId: post.userId,
                                blockedUserId: user.id
                            },
                            {
                                blockedUserId: post.userId,
                                userId: user.id
                            }
                        ]
                    }
                });

                if (blockedUser)
                    throw new Error("this user is blocked");

                // check if this post is already liked or not 
                const likes = (await user.getLikes({
                    where: {
                        postId: postId
                    }
                })).pop();


                // if the post already liked remove the likes 
                // and decrease the number of likes in the post 
                if (likes) {
                    await likes.destroy()
                    await post.update({ likes: post.likes - 1 })
                    return false;
                } else {
                    // else if this is the first like for this user to this post 
                    // then add the post to the likes
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

                    await db.UserPostInteraction.create({
                        userId: user.id,
                        postId: post.id,
                        interactionType: 'Like'
                      });

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
        },

        editPost: async (_, { postInput }, { db, user }) => {
            try {
                const post = await db.Post.findOne({
                    where: {
                        userId: user.id,
                        id: postInput.id
                    },
                    include: [{
                        model: db.Media,
                        as: "media"
                    }, {
                        model: db.Reel,
                        as: "reel",

                        include: [{
                            model: db.Media,
                            as: "thumbnail"
                        }]
                    }, {
                        model: db.HashTag,
                        as: "hashtags"
                    }, {
                        model: db.Work,
                        as: "work",

                    }, {
                        model: db.Service,
                        as: "service"
                    }, {
                        model: db.Keyword,
                        as: "keywords"
                    }]
                });

                if (post == null)
                    throw new Error("Post not found");

                if (post.media && post.media.length > 0 && !postInput.media) {
                    throw new Error("Media is required");
                }

                await post.removeHashtags(post.hashtags.map(hashtag => hashtag.id));
                await post.removeKeywords(post.keywords.map(keyword => keyword.id));
                var keywords = [];

                if (post.type == "work") {
                    keywords = postInput.workInput.keywords
                    //postInput.workInput.postId = post.id;    
                    await post.work.update(postInput.workInput);
                    post.work.category = db.Category.findByPk(postInput.workInput.categoryId)

                }

                if (post.type == "service") {
                    keywords = postInput.serviceInput.keywords
                    await post.service.update(postInput.serviceInput);
                    post.service.category = db.Category.findByPk(postInput.workInput.categoryId)
                }

                for (var index = 0; index < keywords.length; index++) {

                    var keyword = keywords[index];

                    const keywordExists = await db.Keyword.findOne({
                        where: {
                            name: keyword
                        }
                    });

                    if (keywordExists) {
                        await post.addKeyword(keywordExists);
                        keywords[index] = keywordExists;
                        continue;
                    }

                    var newKyeword = await db.Keyword.create({ name: keyword });
                    await post.addKeyword(newKyeword);
                    keywords[index] = newKyeword;

                }

                post.keywords = keywords;


                if (postInput.media && postInput.media.length > 0) {
                    var uploadableMedia = postInput.media.filter(postMedia => postMedia.id == null && postMedia.file);
                    var oldMedia = postInput.media.filter(postMedia => postMedia.id != null && !postMedia.file);
                    var medium = [];
                    for (let index = 0; index < post.media.length; index++) {
                        const findIndex = oldMedia.findIndex(postMedia => postMedia.id == post.media[index].id);
                        if (findIndex < 0) {
                            // the user want to remove this piece of media  
                            await post.media[index].destroy();
                            // delete the files from the storage 
                            await deleteFiles([post.media[index].path]);
                        }
                        else {
                            medium.push(post.media[index]);
                        }
                    }

                    var outputs = [];
                    if (post.type == "image" && uploadableMedia && uploadableMedia.length > 0)
                        outputs = await uploadFiles(uploadableMedia.map(image => image.file), UPLOAD_POST_IMAGES_DIR);


                    if (post.type == "work" && uploadableMedia && uploadableMedia.length > 0)
                        outputs = await uploadFiles(uploadableMedia.map(image => image.file), UPLOAD_POST_WORKS_DIR);

                    if (post.type == "service" && uploadableMedia && uploadableMedia.length > 0)
                        outputs = await uploadFiles(uploadableMedia.map(image => image.file), UPLOAD_POST_SERVICES_DIR);


                    if (post.type == "reel" && uploadableMedia && uploadableMedia.length > 0) {

                        outputs = await uploadFiles(uploadableMedia.map(video => video.file), UPLOAD_POST_VIDEOS_DIR);
                        // upload thumbnail to the given directory 
                        // and associate it to the reel 
                        // and associate the reel to the post 
                        await deleteFiles([post.reel.thumbnail.path]);
                        var thumbnail = (await uploadFiles([postInput.reel.thumbnail.file], UPLOAD_POST_THUMBNAILS_DIR)).pop();

                        if (thumbnail) {
                            await post.reel.thumbnail.update({
                                path: thumbnail
                            });
                            post.reel.thumbnail.path = thumbnail;
                        }
                    }

                    for (let index = 0; index < outputs.length; index++) {
                        // insert media into database 
                        // add it to the post 
                        const media = await db.Media.create({
                            path: outputs[index]
                        });

                        await post.addMedia(media);
                        medium.push(media);
                    }
                    post.media = medium;
                }


                await post.update({
                    title: postInput.title
                })

                return post;

            } catch (error) {
                console.log(error.message);
                return new ApolloError(error.message);
            }
        },


        unImportant: async (_, { postId }, { db, user }) => {
            try {


                const post = await db.Post.findByPk(postId);
                if (!post) {
                    throw new Error("Post do not exists");
                }

                /*
                if (post.userId == user.id )
                    return false ; 
                */

                const unImportantPost = (await user.getUnimportantPosts({ where: { id: postId } })).pop();

                if (unImportantPost) {
                    await user.removeUnimportantPosts(post);
                    return false;
                }

                await user.addUnimportantPosts(post);
                return true;

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}