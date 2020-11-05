const key = "AIzaSyApkcksxCxSepWk9ihpBCQD6dj4xoATcAQ";
let search = "If truth be told monk";
let author = " Om Swami ";
let isbn = 9781455509102;
const img = fetch(`https://books.googleapis.com/books/v1/volumes?q=${search}&maxResults=1&printType=BOOKS&key=${key}
`)
    .then(response => response.json())
    .then(response => response);

console.log(img)