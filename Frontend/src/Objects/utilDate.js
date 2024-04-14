// Function to format UTC date string
function formatUTCDate(dateString) {
  const date = new Date(dateString); // Creating Date object from dateString
  let hours = date.getUTCHours(); // Getting hours from UTC date
  const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Getting minutes and padding with zero if necessary
  const ampm = hours >= 12 ? 'PM' : 'AM'; // Determining AM/PM
  hours = hours % 12; // Converting to 12-hour format
  hours = hours ? hours : 12; // If hours is 0, set it to 12
  const strTime = hours + ':' + minutes + ' ' + ampm; // Constructing time string
  // Constructing date string in the format dd-mm-yyyy hh:mm AM/PM
  return String(date.getUTCDate()).padStart(2, '0') + "-" + String(date.getUTCMonth() + 1).padStart(2, '0') + "-" + date.getUTCFullYear() + " " + strTime;
}

export default formatUTCDate; // Exporting formatUTCDate function
