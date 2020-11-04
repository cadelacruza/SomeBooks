class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

}


class UI {
    static addBook(book) {
        const container = document.querySelector(".bookshelf");

        const section = document.createElement("section");

        section.innerHTML = `
        <p>${book.title}</p>
        <p>${book.author}</p>
        <p>${book.isbn}</p>
        `;

        container.appendChild(section);
    }

    static gridOn() {
        const container = document.querySelector(".bookshelf");
        container.classList.add("active");
    }
}

document.querySelector("button").addEventListener("click", (e) => {
    e.preventDefault();
    const titulo = document.querySelector("#titulo").value;
    const autor = document.querySelector("#autor").value;
    const isbn = document.querySelector("#ISBN").value;

    const libro = new Book(titulo, autor, isbn);
    UI.addBook(libro);
})