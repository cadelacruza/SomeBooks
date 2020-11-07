class Book {
    constructor(title, author, isbn, cover) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.cover = cover;
    }

}


class UI {
    static counter = 0;

    static displaySavedBooks() {
        const books = Store.getBooks();
        books.forEach(book => UI.bookContainer(book.title, book.author, book.isbn, book.cover));
    }
    static bookContainer(title, author, isbn, img) {
        const grandParent = document.querySelector(".bookshelf")
        const parent = document.createElement("article");
        const imagen = document.createElement("img");

        // imagen.src = img;
        // parent.appendChild(imagen);

        parent.innerHTML = `
        <div class="delete" data-isbn=${isbn}>&times</div>
        <img src=${img} alt="Book cover">
        <div class="data-wrapper">
         <h2>${title}</h2>
         <p>${author}</p>
         <p>${isbn}</p>
        <div>
        `;



        parent.classList.add("libro");

        grandParent.appendChild(parent);
    }

    static addBook(book) {
        if (UI.counter === 0) {
            UI.gridOn();
        }
        UI.counter++;
    }

    static deleteBook() {
        UI.counter--;
        if (UI.counter === 0) {
            UI.gridOff();
        }
    }



    static gridOn() {
        document.querySelector("#message").classList.add("active");
        const container = document.querySelector(".bookshelf");
        container.classList.add("active");
    }

    static gridOff() {
        const container = document.querySelector(".bookshelf");
        container.classList.remove("active");
        document.querySelector("#message").classList.remove("active");
    }

    static showAlert(message, color) {
        const div = document.createElement("div");
        div.classList.add(`${color}`, `alert`);
        div.innerText = message;
        const container = document.querySelector(".top");
        const main = document.querySelector("form");
        container.insertBefore(div, main);

        setTimeout(() => document.querySelector(".alert").remove(), 2000)
    }
}

class Store {



    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            return [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    }

    static saveBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem("books", JSON.stringify(books));
    }
}


const key = "AIzaSyApkcksxCxSepWk9ihpBCQD6dj4xoATcAQ";
//This function will display the book;
const displayBook = async (libro) => {
    const response = await fetch(`https://books.googleapis.com/books/v1/volumes?q=${libro.title}&maxResults=1&printType=BOOKS&key=${key}`);
    const data = await response.json();
    console.log(data);
    const img = data.items[0].volumeInfo.imageLinks.thumbnail;
    const isbn = data.items[0].volumeInfo.industryIdentifiers[0].identifier;
    UI.bookContainer(libro.title, libro.author, libro.isbn === "" ? isbn : libro.isbn, img);
    UI.showAlert("Book added", "green");
    libro.cover = img;
    libro.isbn = libro.isbn === "" ? isbn : libro.isbn;
    Store.saveBook(libro);
}


//Click button event
document.querySelector("button").addEventListener("click", (e) => {
    e.preventDefault();
    const titulo = document.querySelector("#titulo").value;
    const autor = document.querySelector("#autor").value;
    const isbn = document.querySelector("#ISBN").value;

    if (titulo === "" || autor === "") {
        UI.showAlert("Please, fill in all the required fields", "red");
    } else {
        const libro = new Book(titulo, autor, isbn);
        displayBook(libro);

        console.log(libro);
        UI.addBook(libro);
        //Store.saveBook(libro);
    }
})


document.querySelector(".bookshelf").addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        console.log("sup");
        e.target.parentElement.remove();
        UI.deleteBook();
        //console.log(e.target.dataset.isbn);
        Store.removeBook(e.target.dataset.isbn);
        UI.showAlert("Book deleted", "red");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const numOfBooks = Store.getBooks().length;
    UI.counter = numOfBooks;
    if (numOfBooks > 0) {
        UI.gridOn();
    }
    UI.displaySavedBooks();
});


