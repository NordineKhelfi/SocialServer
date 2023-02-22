const DAY  = 24 * 60 * 60 * 1000 ; 

const getStoryExpirationDate = () => {

    const currentDate = new Date() ; 
    const tommorow = new Date ( currentDate.getTime() + DAY ) ; 

    return tommorow ; 

};


export { getStoryExpirationDate }