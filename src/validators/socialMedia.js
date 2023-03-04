import * as yup from "yup";

const SocialMediaValidator = yup.object().test("not-valid", (socialMedia) => {


    
    const oneSet = (
        socialMedia.facebook
        || socialMedia.twitter
        || socialMedia.snapshot
        || socialMedia.instagram
    );

    if (!oneSet)
        return false; 

    if (socialMedia.facebook && !socialMedia.facebook.startsWith("http"))
        return false;

    if (socialMedia.twitter && !socialMedia.twitter.startsWith("http"))
        return false;

    if (socialMedia.snapshot && !socialMedia.snapshot.startsWith("http"))
        return false;

    if (socialMedia.instagram && !socialMedia.instagram.startsWith("http"))
        return false;
    
    return true;

})


export {
    SocialMediaValidator
}