function formatUTCDate(dateString) {
  const date = new Date(dateString);
  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strTime = hours + ":" + minutes + " " + ampm;
  return (
    String(date.getUTCDate()).padStart(2, "0") +
    "-" +
    String(date.getUTCMonth() + 1).padStart(2, "0") +
    "-" +
    date.getUTCFullYear() +
    " " +
    strTime
  );
}

module.exports = {
  formatUTCDate,
};
