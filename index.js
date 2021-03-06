"use strict";

const library = document.querySelector(".library");
const addBookButton = document.querySelector(".btn-add-book");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModalButton = document.querySelector(".btn--close-modal");
const modalForm = document.querySelector(".modal__form");
const inputTitle = document.querySelector('input[name="title"]');
const inputAuthor = document.querySelector('input[name="author"]');
const inputPages = document.querySelector('input[name="pages"]');
const inputRead = document.querySelector('input[name="read"]');

const cleanData = function (userInput) {
  return DOMPurify.sanitize(userInput);
};

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = uuid.v4();
  }
}

class Library {
  constructor() {
    this.myLibrary = [];
  }

  addBookToLibrary(title, author, pages, read) {
    const book = new Book(title, author, pages, read);
    this.myLibrary.push(book);
  }

  renderLibrary() {
    library.innerHTML = "";
    this.myLibrary.forEach((book) => {
      const html = cleanData(`
        <div class="card" data-id="${book.id}">
          <div class="title">"${book.title}"</div>
          <p class="by">by</p>
          <div class="author">${book.author}</div>
          <div class="hr"></div>
          <div class="pages">${
            book.pages > 25000 ? "a lot of" : Math.trunc(book.pages)
          } pages</div>
          <div class="hr"></div>
          <button class="status btn ${book.read ? "read" : "not-read"}">${
        book.read ? "read" : "not read"
      }</button>
          <button class="btn btn-delete">delete</button>
        </div>
      `);
      library.insertAdjacentHTML("beforeend", html);
    });
  }

  deleteBook(id) {
    // remove book from DOM
    const cardToDelete = document.querySelector(`[data-id="${id}"]`);
    library.removeChild(cardToDelete);

    // remove book from array
    const indexToDelete = this.myLibrary.findIndex((book) => book.id === id);
    this.myLibrary.splice(indexToDelete, 1);
  }

  changeReadStatus(id) {
    const book = document.querySelector(`[data-id="${id}"]`);
    book.querySelector(".status").classList.toggle("read");

    // select correct book
    const bookToChangeStatus = this.myLibrary.find((book) => book.id === id);
    bookToChangeStatus.read = !bookToChangeStatus.read;
    this.renderLibrary();
  }
}

const lib = new Library();

lib.addBookToLibrary("The Little Prince", "Antoine de Saint-Exup??ry", 96, true);
lib.addBookToLibrary(
  "Harry Potter and the Philosopher's Stone",
  "J. K. Rowling",
  309,
  true
);
lib.addBookToLibrary("The Hobbit", "J. R. R. Tolkien", 366, false);

lib.renderLibrary();

library.addEventListener("click", function (e) {
  if (!e.target.classList.contains("btn-delete")) return;
  const id = e.target.closest(".card").dataset.id;
  lib.deleteBook(id);
});

library.addEventListener("click", function (e) {
  const readButtonCondition =
    !e.target.classList.contains("btn") ||
    e.target.classList.contains("btn-delete");
  if (readButtonCondition) return;
  const id = e.target.closest(".card").dataset.id;
  lib.changeReadStatus(id);
});

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

addBookButton.addEventListener("click", openModal);

closeModalButton.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

modalForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let book = {};
  const data = new FormData(modalForm);
  for (const [name, value] of data) {
    book[name] = value;
  }
  lib.addBookToLibrary(book.title, book.author, book.pages, book.read);
  book = null; // dereference
  lib.renderLibrary();
  closeModal();
  inputAuthor.value = inputTitle.value = inputPages.value = "";
  inputRead.checked = false;
});
