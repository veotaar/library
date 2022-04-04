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

let myLibrary = [];

const Book = function (title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = uuid.v4();
};

const addBookToLibrary = function (title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
};

addBookToLibrary("0", "0", 421, false);
addBookToLibrary("1", "1", 421, false);
addBookToLibrary("2", "2", 421, false);
addBookToLibrary("3", "3", 421, false);
addBookToLibrary("4", "4", 421, false);

const renderLibrary = function () {
  library.innerHTML = "";
  myLibrary.forEach((book) => {
    const html = `
      <div class="card" data-id="${book.id}">
        <div class="title">"${book.title}"</div>
        <div class="author">${book.author}</div>
        <div class="pages"> ${book.pages} pages</div>
        <button class="btn read">${book.read ? "read" : "not read"}</button>
        <button class="btn btn-delete">delete</button>
      </div>
    `;
    library.insertAdjacentHTML("beforeend", html);
  });
};

renderLibrary();

const deleteBook = function (id) {
  const cardToDelete = document.querySelector(`[data-id="${id}"]`);
  library.removeChild(cardToDelete);
  const indexToDelete = myLibrary.findIndex((book) => book.id === id);
  myLibrary.splice(indexToDelete, 1);
};

library.addEventListener("click", function (e) {
  if (!e.target.classList.contains("btn-delete")) return;
  const id = e.target.closest(".card").dataset.id;
  deleteBook(id);
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
  const book = {};
  const data = new FormData(modalForm);
  for (const [name, value] of data) {
    book[name] = value;
  }
  addBookToLibrary(book.title, book.author, book.pages, book.read);
  renderLibrary();
  closeModal();
  inputAuthor.value = inputTitle.value = inputPages.value = "";
  inputRead.checked = false;
});
