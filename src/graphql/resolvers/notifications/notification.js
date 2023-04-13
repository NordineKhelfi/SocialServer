import { ApolloError } from "apollo-server-express"

export default {


    Query: {
        getFollowersNotifications : async ( _ , {offset , limit} , {db , user}) => {
            try {   
                
                var followers = await user.getFollowers({
                    
                    include : [{
                        model : db.User , 
                        as : "user" , 
                        include : [{
                            model : db.Media , 
                            as : "profilePicture"
                        }] 
                    }] , 
                    order: [["createdAt", "DESC"]],
                    offset : offset , 
                    limit : limit
                }) ; 

                return followers.map(follower => ({
                    follow : follower
                })) ; 
            }catch(error) {
                return ApolloError(error.message) ; 
            }
        } ,
        
        getLikePostNotification : async ( _ , {offset , limit} , { db , user}) => { 
            try {   

                var likes = await  db.Like.findAll({
                    
                    include : [{
                        model : db.User , 
                        as : "user" , 
                        
                        include : [{
                            model : db.Media , 
                            as : "profilePicture"
                        }]
                    } , {
                        model : db.Post, 
                        as : "post"  , 
                        where : {
                            userId : user.id 
                        } , 
                        include : [{ 
                            model : db.Media , 
                            as : "media" ,                         
                        } ,{
                            model : db.Reel , 
                            as : "reel" , 
                            include : [{
                                model : db.Media , 
                                as : "thumbnail"
                            }]
                        }] 
                    }] , 
                    offset , limit   , 
                    order: [["createdAt", "DESC"]],
                })

                return likes.map(like => ({
                    like 
                }))

            }catch(error) { 
                return new ApolloError(error.message) ; 
            }
        } , 

        getStoryCommentNotification : async ( _ , { offset , limit} , {db , user}) => {
            try { 

                var storyComments = await db.StoryComment.findAll({
                    include : [{
                        model : db.User , 
                        as : "user" , 
                        include : [{
                            model : db.Media , 
                            as : "profilePicture"
                        }]
                    } , {
                        model : db.Story , 
                        as : "story" , 
                        include : [{
                            model : db.Media , 
                            as : "media" 
                        }] , 
                        where : {
                            userId : user.id 
                        }
                    }] , 
                    offset , limit , 
                    order : [["createdAt" , "DESC"]]
                })  ; 


                return storyComments.map(storyComment => ({
                    storyComment
                })) ; 

            }catch(error) {
                return new ApolloError(error.message) ; 
            }
        } , 
        getCommentPostNotification : async ( _ , { offset , limit} , {db , user}) => {
            try { 

                var comments = await db.Comment.findAll({
                    include : [{
                        model : db.User , 
                        as : "user" , 
                        include : [{
                            model : db.Media , 
                            as : "profilePicture"
                        }] 
                    } , { 
                        model : db.Post , 
                        as : "post" , 
                        include : [{
                            model : db.Media , 
                            as : "media"
                        }] , 
                        where : { 
                            userId : user.id
                        }
                
                    }] , 
                    order : [["createdAt" , "DESC"]] , 
                    offset , limit 
                })  ; 


                return comments.map( comment => ({
                    comment
                })) ; 

            }catch(error) {
                return new ApolloError(error.message) ; 
            }
        } , 
        getReplayCommentNotification : async ( _ , { offset , limit} , {db , user}) => {
            try { 

                var replays = await db.Replay.findAll({
                    include : [{ 
                        model : db.User , 
                        as : "user" , 
                        include : [{
                            model : db.Media , 
                            as : "profilePicture"
                        }]
                    } , { 
                        model : db.Comment , 
                        as : "comment" , 
                        where : {
                            userId : user.id 
                        }
                    }, { 
                        model : db.Media , 
                        as : "media"
                    }] , 
                    order : [["createdAt" , "DESC"]] , 
                    offset , limit 
                }) ; 

                return replays.map( replay => ({
                    replay
                })) ; 


            }catch(error) {
                return new ApolloError(error.message) ; 
            }
        } , 
    }
}