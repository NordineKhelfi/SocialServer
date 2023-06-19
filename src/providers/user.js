import conversation from "../graphql/resolvers/message/conversation";
import { deleteFiles } from "./media";

export const removeAccount = async (db, userId) => {
    try {
        const user = await db.User.findByPk(userId);

        if (user.disabled == false)
            return;

        var media = [];

        var prolfilePicture = await user.getProfilePicture()

        var postsMedia = await db.Media.findAll({
            include: [{
                model: db.Post,
                as: "posts",
                required: true,
                where: {
                    userId: userId
                }
            }]
        });


        var storiesMedia = await db.Media.findAll({
            include: [{

                model: db.Story,
                as: "story",
                required: true,
                where: {
                    userId: userId
                }
            }]
        });


        var reelsThumbnails = await db.Media.findAll({
            include: [{
                model: db.Reel,
                as: "reel",
                required: true,
                include: [{
                    model: db.Post,
                    as: "post",
                    required: true,
                    where: {
                        userId: userId
                    }
                }]
            }]
        });

        var commentsMedia = await db.Media.findAll({
            include: [{
                model: db.Comment,
                as: "comment",
                where: {
                    userId: userId
                }
            }]
        });


        var replayMedia = await db.Media.findAll({
            include: [{
                model: db.Replay,
                as: "replay",
                where: {
                    userId: userId
                }
            }]
        })


        var conversationMember = await db.ConversationMember.findAll({
            where: {
                userId: userId,

            }
        });


        if (prolfilePicture)
            media.push(prolfilePicture);

        media = [...media, ...postsMedia, ...storiesMedia, ...reelsThumbnails, ...commentsMedia, ...replayMedia];


        for (let index = 0; index < conversationMember.length; index++) {
            await conversation.Mutation.deleteConversation(null, { conversationId: conversationMember[index].conversationId }, { db, user })
        }

        await deleteFiles(media.map(m => m.path));

    
        await user.destroy();

        //console.log(messsageMedia.map(messageMedia => messageMedia.path)) ; 
        for (let index = 0; index < media.length; index++) {
            media[index].destroy()
        }
    

    } catch (error) {
        console.log(error)
    }


}

// profile Picture
/// Stories
// posts
// thumbnails


// Comments
// Replays 
