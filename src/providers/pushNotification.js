const FCM = require('fcm-node');
const serverKey = 'AAAAt7I2220:APA91bEnVmVaurvuj17B5mcPS2oL_EB0UQ-eGUpC2VwFg6Q_L8uq8RTUa2Fg5DYNRa76w59dbLN5e6rqx5UXeBRLdgaxcf2r9tmEryDWmEVvlAF8NPXFWyqPtDz8EwSG29mT5iRb2bpg'; //put your server key here
const fcm = new FCM(serverKey);

const sendPushNotification = async (to, data) => {
    if (!to.token) return;

    fcm.send({
        to: to.token,
        data: {
            ...data
        }
    }, function (response, error) {
        if (!error)
            console.log("send");
    });
}

export {
    sendPushNotification
}