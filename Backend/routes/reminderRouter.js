const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    client
} = require("../database/database");
const nodemailer = require("nodemailer");
const cron = require('node-cron');

const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");
const ActivitiesCollection = db.collection("Activities");
function formatUTCDate(dateString) {
    const date = new Date(dateString);
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getUTCFullYear() + "-" + String(date.getUTCMonth() + 1).padStart(2, '0') + "-" + String(date.getUTCDate()).padStart(2, '0') + " " + strTime;
}

// Define the function that sends the emails
async function sendEmails() {
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "integrativeprojectgroupthree@gmail.com",
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const currentDate = new Date();
    const threeDaysFromNow = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() + 3, 0, 0, 0));
    //console.log('threeDaysFromNow: ', threeDaysFromNow);
    const fourDaysFromNow = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() + 4, 0, 0, 0));
    //console.log('fourDaysFromNow : ', fourDaysFromNow );
    
    const activities = await ActivitiesCollection.find({
        StartDate: {
            $gte: threeDaysFromNow,
            $lt: fourDaysFromNow,
        },
    }).toArray();
// Send an email to each registered user
// Iterate over each activity

for (const activity of activities) {
   // console.log('activity: ', activity);
    //console.log('formatETDate(activity.StartDate): ', formatETDate(activity.StartDate));
   // console.log('formatETDate(activity.EndDate): ', formatETDate(activity.EndDate));
    
    console.log('activity.StartDate: ', formatUTCDate(activity.StartDate));
    console.log('activity.EndDate: ', formatUTCDate(activity.EndDate));
    
    // Send an email to each registered user
    for (const email of activity.registeredUsers) {
        let htmlContent = `<h3>${activity.post_title}</h3> <p>Hello, we want to remind you that you registered to the following activity: ${activity.post_title}. It will be taking place in three days!</p>`;
        
        htmlContent += `<p>The event starts at: ${formatUTCDate(activity.StartDate)}</p>`;
htmlContent += `<p>And finishes at: ${formatUTCDate(activity.EndDate)}</p>`;
htmlContent += `<p>${activity.post_content}</p>`;
        htmlContent += `<img src="${activity.post_thumbnail}" alt="Activity Thumbnail" style="width: 100%; max-width: 600px;">`;
        htmlContent += `<p>Click on this <a href="${activity.event_url}">${activity.post_title}</a> to go to the event post on the Valcourt2030 website and see the details of the event.</p>`;
        
    
        await transporter.sendMail({
            from: '"Valcour2030" <integrativeprojectgroupthree@gmail.com>',
            to: email,
            subject: `The event ${activity.post_title} you subscribed to will be taking place the ${new Date(activity.StartDate).toLocaleDateString('en-GB')} `,
            html: htmlContent,
        }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    }
}
}



// Export the function
module.exports = sendEmails;