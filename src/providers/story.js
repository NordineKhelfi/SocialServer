import { deleteFiles } from "./media";

const DAY = 24 * 60 * 60 * 1000;
const MINTUE = 15 * 1000;
const getStoryExpirationDate = () => {

    const currentDate = new Date();
    const tommorow = new Date(currentDate.getTime() + DAY);

    return tommorow;

};

const destroyStory = async (story) => {
    await deleteFiles([story.media.path])
    await story.media.destroy();
    await story.destroy();
 

}
const handleStoriesExpirations = async (db) => {
    var stories = await db.Story.findAll({
        include: [{
            model: db.Media,
            as: "media"
        }]
    });

    for (var index = 0; index < stories.length; index++) {

        var currentTime = new Date().getTime();
        var expiredAt = Number(stories[index].expiredAt);
        var deltaTime = currentTime - expiredAt;

        if ((deltaTime >= 0)) {
            destroyStory(stories[index]);
        } else {
        
            setTimeout(destroyStory , Math.abs(deltaTime) , stories[index]) ; 
        }

    }

}

export { getStoryExpirationDate, handleStoriesExpirations , destroyStory , DAY , MINTUE }