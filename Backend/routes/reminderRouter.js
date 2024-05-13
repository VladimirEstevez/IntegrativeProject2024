const { client } = require("../database/database");
const nodemailer = require("nodemailer");
const { formatDateFunction } = require("../dateUtils/DateFormattingTool");
const db = client.db("integrativeProjectDB");
const ActivitiesCollection = db.collection("Activities");



// This function sends the reminder emails to the registered users of the activities.
async function sendEmails() {
  
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
      user:process.env.RECIPIENT_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });



  function getESTDate(daysFromNow) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysFromNow);
    currentDate.setHours(0, 0, 0, 0);
  
    // Get the time difference between UTC time and local time, in minutes
    const timezoneOffset = currentDate.getTimezoneOffset() * 60 * 1000;
  
    // Get the time difference between EST and UTC, in minutes
    // EST is UTC-5, but during daylight saving time it's UTC-4
    const estOffset = (currentDate.getMonth() > 2 && currentDate.getMonth() < 11 ? 4 : 5) * 60 * 60 * 1000;
  
    // Subtract the two time differences to get the date in EST
    const estDate = new Date(currentDate.getTime() + timezoneOffset - estOffset);
  
    return estDate;
  }
  
  const threeDaysFromNow = getESTDate(3).toISOString();;
  console.log('threeDaysFromNow: ', threeDaysFromNow);
  const fourDaysFromNow = getESTDate(4).toISOString();;
  console.log('fourDaysFromNow: ', fourDaysFromNow);

  // Get the activities coming in three days from now.
  const activities = await ActivitiesCollection.find({
    StartDate: {
      $gte: threeDaysFromNow,
      $lt: fourDaysFromNow,
    },
  }).toArray();
  //console.log('activities: ', activities);

  // Iterate over each activity and send email to registered users of that activity.
  for (const activity of activities) {
    //console.log("activity.StartDate: ", (activity.StartDate));
    //console.log("activity.EndDate: ", (activity.EndDate));
    console.log('activity.registeredUsers: ', activity.registeredUsers);

    // Send an email to each registered user
    for (const email of activity.registeredUsers) {
      let htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h3>${activity.post_title}</h3>
          <p>Bonjour, nous voulons vous rappeler que vous êtes inscrit à l'activité suivante : ${activity.post_title}. Elle aura lieu dans trois jours !</p>
        </div>`;
        try {
          htmlContent += `<p>L'événement commence à : ${formatDateFunction(activity.StartDate)}</p>`;
        } catch (error) {
          console.error('Error formatting StartDate:', error);
        }
        
        try {
          htmlContent += `<p>Et se termine à : ${formatDateFunction(activity.EndDate)}</p>`;
        } catch (error) {
          console.error('Error formatting EndDate:', error);
        }
      htmlContent += `<p>${activity.post_content}</p>`;
      htmlContent += `<img src="${activity.post_thumbnail}" alt="Activity Thumbnail" style="width: 100%; max-width: 600px;">`;
      htmlContent += `<p>Cliquez sur ce <button onclick="window.location.href='${activity.event_url}'">${activity.post_title}</button> pour accéder à l'article de l'événement sur le site de Valcourt2030 et voir les détails de l'événement.</p>`;

      await transporter.sendMail(
        {
          from: '"Valcourt2030" <integrativeprojectgroupthree@gmail.com>',
          to: email,
          subject: `L'événement ${
            activity.post_title
          } auquel vous vous êtes inscrit aura lieu le ${formatDateFunction(activity.StartDate)} `,
          html: htmlContent,
        },
        function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        }
      );
    }
  }
}

// Export the function
module.exports = sendEmails;
