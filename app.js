const bookForm = document.querySelector("#book-form");
const bookList = document.querySelector("#book-list");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const isbn = document.querySelector("#isbn");

window.addEventListener("DOMContentLoaded", function() {
    const ls = new LS();
    const ui = new UI();
    const books = ls.getBooksFromLS();
    for (const book of books) {
        ui.addBookToList(book);
    }

});

bookForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const titleValue = title.value;
    const authorValue = author.value;
    const isbnValue = isbn.value
    const ui = new UI();
    const ls = new LS();

    if (!titleValue || !authorValue || !isbnValue) {
        ui.showMessage("Check fields values", "error");
    } else {
        const book = new Book(titleValue, authorValue, isbnValue);

        ls.addBookToLS(book);

        ui.showMessage("The book was added", "success");
        ui.addBookToList(book);
        ui.clearFields();
    }

});

bookList.addEventListener("click", function(event) {
    if (event.target.matches(".remove")) {
        const ui = new UI();
        const ls = new LS();
        const isbn = event.target.parentElement.previousElementSibling.textContent;
        ui.removeBookFromList(event.target.closest("tr"));
        ls.removeBookFromLS(isbn);
    }
});

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const markup = `<tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><i class="remove fa-solid fa-circle-xmark"></i></td>
        </tr>`;
        bookList.insertAdjacentHTML("beforeend", markup)
    }

    removeBookFromList(book) {
        book.remove();
    }

    clearFields() {
        title.value = "";
        author.value = "";
        isbn.value = "";
    }

    showMessage(text, type) {
        const markup = `<div class="message ${type}">
        ${text}
        </div>`;
        bookForm.insertAdjacentHTML('afterbegin', markup);
        setTimeout(() => {
            document.querySelector(".message").remove();
        }, 2000);
    }
}

class LS {
    addBookToLS(book) {
        let books = this.getBooksFromLS();
        books.push(book);
        this.setItemToLS(books);
    }

    removeBookFromLS(isbn) {
        let books = this.getBooksFromLS();
        books.forEach((book, ind) => {
            if (book.isbn == isbn) {
                books.splice(ind, 1);
            }
        });
        this.setItemToLS(books);
    }

    setItemToLS(books) {
        localStorage.setItem("books", JSON.stringify(books));
    }

    getBooksFromLS() {
        const books = JSON.parse(localStorage.getItem("books")) || [];
        return books;
    }
}