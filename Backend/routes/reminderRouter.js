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
const { formatUTCDate } = require('../dateUtils/formatDate.js')

// function formatUTCDate(dateString) {
//     const date = new Date(dateString);
//     let hours = date.getUTCHours();
//     const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'
//     const strTime = hours + ':' + minutes + ' ' + ampm;
//     return date.getUTCFullYear() + "-" + String(date.getUTCMonth() + 1).padStart(2, '0') + "-" + String(date.getUTCDate()).padStart(2, '0') + " " + strTime;
// }

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
//console.log('activity: ', activities);

for (const activity of activities) {
    //console.log('formatETDate(activity.StartDate): ', formatETDate(activity.StartDate));
   // console.log('formatETDate(activity.EndDate): ', formatETDate(activity.EndDate));
    
    console.log('activity.StartDate: ', formatUTCDate(activity.StartDate));
    console.log('activity.EndDate: ', formatUTCDate(activity.EndDate));
    
    // Send an email to each registered user
    for (const email of activity.registeredUsers) {
        let htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h3>${activity.post_title}</h3>
          <p>Bonjour, nous voulons vous rappeler que vous êtes inscrit à l'activité suivante : ${activity.post_title}. Elle aura lieu dans trois jours !</p>
        </div>`;        
        htmlContent += `<p>L'événement commence à : ${formatUTCDate(activity.StartDate)}</p>`;
        htmlContent += `<p>Et se termine à : ${formatUTCDate(activity.EndDate)}</p>`;
        htmlContent += `<p>${activity.post_content}</p>`;
        htmlContent += `<img src="${activity.post_thumbnail}" alt="Activity Thumbnail" style="width: 100%; max-width: 600px;">`;
        htmlContent += `<p>Cliquez sur ce <button onclick="window.location.href='${activity.event_url}'">${activity.post_title}</button> pour accéder à l'article de l'événement sur le site de Valcourt2030 et voir les détails de l'événement.</p>`;
        
    
        await transporter.sendMail({
            from: '"Valcour2030" <integrativeprojectgroupthree@gmail.com>',
            to: email,
            subject: `L'événement ${activity.post_title} auquel vous vous êtes inscrit aura lieu le ${new Date(activity.StartDate).toLocaleDateString('fr-FR')} `,
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