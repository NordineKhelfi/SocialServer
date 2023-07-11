import { ApolloError } from "apollo-server-express"

export default {


    Mutation: {
        sendReport: async (_, { reportInput }, { db, user }) => {
            try {
                if (!reportInput.userId && !reportInput.postId && !reportInput.conversationId)
                    throw new Error("Content is needed");

                var userReport = null;
                var conversation = null;
                var post = null;

                const reason = await db.ReportReason.findByPk(reportInput.reasonId);
                if (!reason)
                    throw new Error("Reason not found");


                if (reportInput.userId) {
                    userReport = await db.User.findByPk(reportInput.userId);
                    if (userReport == null)
                        throw new Error("User to report not found");
                }
                else if (reportInput.conversationId) {
                    const conversationMember = await db.ConversationMember.findOne({
                        where: {
                            userId: user.id,
                            conversationId: reportInput.conversationId
                        },
                        include: [{
                            model: db.Conversation,
                            as: "conversation"
                        }]
                    });
                    if (!conversationMember)
                        throw new Error("Conversation not found");

                    conversation = conversationMember.conversation;

                } else if (reportInput.postId) {
                    post = await db.Post.findByPk(reportInput.postId);
                    if (!post)
                        throw new Error("Post Not found");
                }

           

                var report = await db.Report.create({
                    reporterId: user.id,
                    reasonId: reason.id,
                    userId: (userReport) ? userReport.id : null,
                    postId: (post) ? post.id : null,
                    conversationId: (conversation) ? conversation.id : null,
                    details: reportInput.details
                });

                report.createdAt = new Date();
                return report;

            } catch (error) {
                return new ApolloError(error.message)
            }
        }
    }
}