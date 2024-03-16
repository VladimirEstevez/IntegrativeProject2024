var date = new Date('2016-08-25T00:00:00')
var userTimezoneOffset = date.getTimezoneOffset() * 60000;
var print = new Date(date.getTime() - userTimezoneOffset);
console.log('print: ', print);
console.log('date: ', date);
