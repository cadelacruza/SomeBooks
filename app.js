class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

}


class UI {
    static counter = 0;

    static bookContainer(title, author, isbn = 12345678, img) {
        const grandParent = document.querySelector(".bookshelf")
        const parent = document.createElement("article");
        const imagen = document.createElement("img");

        parent.innerHTML = `
        <div>&times</div>
        <h2>${title}</h2>
        <p>${author}</p>
        <p>${isbn}</p>
        `;

        imagen.src = img;
        parent.appendChild(imagen);

        grandParent.appendChild(parent);
    }

    static addBook(book) {
        if (UI.counter === 0) {
            UI.gridOn();
        }
        UI.counter++;
    }

    static deleteBook() {
        if (UI.counter === 0) {
            UI.gridOff();
        }
        UI.counter--;
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


const key = "AIzaSyApkcksxCxSepWk9ihpBCQD6dj4xoATcAQ";
//This function will display the book;
const displayBook = async (title, author, isbn) => {
    const response = await fetch(`https://books.googleapis.com/books/v1/volumes?q=${title}&maxResults=1&printType=BOOKS&key=${key}`);
    const data = await response.json();
    console.log(data);
    const img = data.items[0].volumeInfo.imageLinks.thumbnail;

    UI.bookContainer(title, author, isbn, img);
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
        displayBook(libro.title, libro.author, libro.isbn);
        UI.addBook(libro);
        UI.showAlert("Book added", "green")
    }


})