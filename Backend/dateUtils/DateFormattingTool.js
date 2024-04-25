function formatDateFunction(unformattedDate) {
    const options = {
      dateStyle: "medium",
      timeStyle: "short",
    };
  
    const formattedDate = new Date(unformattedDate).toLocaleString("fr-FR", options);
  
    return formattedDate;
  }

  module.exports =  { formatDateFunction };