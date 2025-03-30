let page = 1;
const itemsPerPage = 5;
const totalItems = 50;
const start = (page - 1) * itemsPerPage;
const end = (start, totalItems);
console.log(end);
