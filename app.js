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
        books.forEach(book => {
            UI.bookContainer(book.title, book.author, book.isbn, book.cover)

        });
    }

    static bookContainer(title, author, isbn, img) {
        const grandParent = document.querySelector(".bookshelf")
        const parent = document.createElement("article");
        const imagen = document.createElement("img");

        parent.innerHTML = `
        <div class="iconos">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon quest " id="moreInfo" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" class="icon quest " id="editInfo" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round"  stroke-linejoin="round" stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" class="icon quest " id="deleteBook" data-isbn="${isbn}" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round"  stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </div>
        <div class="data-wrapper">
         <h2>${title}</h2>
         <p>Author: ${author}</p>
         <p>ISBN: ${isbn}</p>
        </div>

        <form class="editSection">
         <input type="text" placeholder="${title}" class="editInput" id="editTitle">
         <input type="text" placeholder="${author}" class="editInput" id="editAuthor">
         <input type="number" placeholder=${isbn} class="editInput" id="editIsbn">
         <section class="btn-wrapper">
          <button id="saveChanges">Save</button>
         </section>
        </form>
        `;

        parent.style.backgroundImage = `url(${img})`;

        parent.classList.add("libro");
        parent.classList.add("quest");
        parent.classList.add("containerB");
        parent.dataset.imgSrc = img;
        grandParent.appendChild(parent);
        UI.updateRemover();
    }

    static addBook(book) {
        if (UI.counter === 0) {
            UI.gridOn();
        }
        UI.counter++;
    }

    static displayBookInfo(e) {

        //console.log(e.target.parentNode);
        //e.target.parentNode.style.display = "none";
        //console.log(e.target.parentNode.parentNode.children[1]);
        // console.log(e.target.parentNode.parentNode);
        e.target.parentNode.parentNode.children[1].classList.add("active");
    }

    static displayEditSec(e) {
        e.target.parentNode.parentNode.children[2].classList.add("active");
    }

    static eliminateBook(e) {
        Store.removeBook(e.target.dataset.isbn);
        e.target.parentNode.parentNode.remove();
        UI.showAlert("Book deleted", "red");
        UI.deleteBook();
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

    static clearFields() {
        document.querySelector("#titulo").value = "";
        document.querySelector("#autor").value = "";
        document.querySelector("#ISBN").value = "";
    }

    static displayOptions(e) {
        if (e.target.classList.contains("quest")) {
            if (e.target.classList.contains("containerB")) {
                e.target.removeAttribute("style");
            }
            e.target.children[0].classList.add("active");
            console.log(e.target.children[0]);
            //     if (e.target.classList.contains("libro"))
            //             console.log(e.target.style.backgroundImage)
            //         console.log(e.target.children[0]);
            //         e.target.children[0].classList.add("active");
            //     console.log("Moved on icons element, active on");
            // }
        }
    }

    static updateRemover() {
        document.querySelectorAll(".libro").forEach(book => book.addEventListener("mouseleave", (e) => UI.hideOptions(e)));
    }

    static hideOptions(e) {
        console.log(e.target)
        e.target.children[0].classList.remove("active");
        e.target.children[1].classList.remove("active");
        e.target.children[2].classList.remove("active");
        e.target.style.backgroundImage = `url(${e.target.dataset.imgSrc})`;
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
    //console.log(data);
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

    UI.clearFields();
});


document.querySelector(".bookshelf-wrapper").addEventListener("click", (e) => {
    if (e.target.id === "deleteBook") {
        UI.eliminateBook(e);
    } else if (e.target.id === "moreInfo") {
        e.target.parentNode.classList.remove("active");
        UI.displayBookInfo(e);
    } else if (e.target.id === "editInfo") {
        e.target.parentNode.classList.remove("active");
        UI.displayEditSec(e);
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

document.querySelector(".bookshelf-wrapper").addEventListener("mouseover", (e) => {
    UI.displayOptions(e)
});