const { Op } = require("sequelize");
const { db } = require("../db");
const webPush = require('web-push');


// console.log(webPush.generateVAPIDKeys());


const publicKey = 'BN69bTRuil6wT1gdV_daOX6usqgVZofjaFUDFz-2WtKeC2YlUGEMz8vvVbqhuA-cp8IwBFfrde6Dp3QhiEwgyfc';
const privateKey = 'mLVmbk81MabnJN3UETnwbV-4LdMsSEmqVey7QqRFogI';


const sub = {"endpoint":"https://fcm.googleapis.com/fcm/send/dxW1nTP8cp8:APA91bFk75BXSjh5WB6FCJjhiiuDd8CFgD5am8bZRuzmdSm0Cgr48QfRqogD037l2cNa2OjIt-QgOyOB0-gKBKppWHT5JDe5Iaj1pPFxTFQUwGKJLkuQMUwwQp1XUG_4qA5FFJ_TW3oi","expirationTime":null,"keys":{"p256dh":"BKXWSFDWvuLIL4aBuIVSue2rLhCUPFBE8KiQm3aqYudg15pagMo6simLk6DDONQXAGr-YGgd_pS9ecZ9deipzWg","auth":"rEUZnC9TCCFEMgLYARo7xg"}}

webPush.setVapidDetails('mailto:example@yopmail.com', publicKey, privateKey);


module.exports = {
    getChats: async (req, res) => {
        const userId = req.session['user'].userId;
        if (!userId) {
            return res.status(401).json({
                message: 'Session exprired'
            });
        }

        const chats = await db.chats.findAll({
            where: {
                [Op.or]: [{ sender_id: userId }, { receiver_id: userId }]
            },
            include:{
             model:db.user
            },
            group:['chats.id','chats.sender_id','chats.receiver_id','user.id']
        });
        if (!chats) {
            return res.json({
                message: 'No chats available'
            })
        }
        res.json({
            data: chats
        });
    },
    sendMessage: async (req, res) => {
        const userId = req.session['user'].userId;
        const {receiver_id, message } = req.body;
        if (!receiver_id || !message) return res.json({ message: 'details missing' })
        const addedMessage = await db.chats.create({
            sender_id:userId,
            receiver_id,
            message
        });
        if (!addedMessage) {
            return res.status(400).json({ message: 'Something went wrong' });
        }
        const payload = {
            "notification":{
              "data":{message:'You have received New Message !'},
              "title":"You Have New Message !",
              "vibrate":[100,50,100]
            }
          }
          
          webPush.sendNotification(sub, JSON.stringify(payload));
        return res.status(201).json({ message: 'Sent successfully' });
    },
    getChatMessages: async (req, res) => {
        const { id: chatUserId } = req.params;
        const userId = req.session['user'].userId;


        if (!chatUserId) return res.status(400).json({ message: 'Plese select the user to continue ' });
        const chats = await db.chats.findAll({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { receiver_id: userId },
                            { sender_id: chatUserId }
                        ]
                    },
                    {
                        [Op.and]: [
                            { receiver_id: chatUserId },
                            { sender_id: userId }
                        ]
                    }

                ]
            },
            include:{
               model:db.user
            }
        });
        if (!chats) {
            return res.json({
                message: 'No chats available'
            })
        }
        res.json({
            data: chats
        });

    }
};