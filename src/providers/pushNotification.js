const FCM = require('fcm-node');
const serverKey = 'AAAAcEI-NfQ:APA91bEycPzj6A5peoBiZopvL9MS_oEk0737wXhuAZjB7baM3lIuj7rk-DUk3iLMl9ByDNh1_VlY2ZMLs0libDjiEsV7VdVbefeWHLRtjrGLrCUTmi63qH3bwaUyV2TC5SbhC28j0QrH'; //put your server key here
const fcm = new FCM(serverKey);



const sendPushNotification = async (to, data) => {



    if (!to.token)
        return;
    fcm.send({
        to : to.token , 
        data : { 
            ...data 
        }
    } , function(response , error) {       
        if ( !error ) 
            console.log("send") ; 
    });
}
export {
    sendPushNotification
}