"use strict";

const Book = function (title, author, pages, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read ? "read" : "not read yet"
    }.`;
  };
};

const book1 = new Book("The Ancestor's Tale", "Richard Dawkins", 548, false);
console.log(book1.info());
