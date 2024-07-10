const express = require('express');
let books = require("./booksdb.js");
const { authenticated } = require('./auth_users.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login." });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author_name = req.params.author;

  let book_values = Object.values(books);

  let filteredByName = book_values.filter((val) => val.author.toLowerCase() === author_name.toLowerCase());
  
  return res.send(filteredByName);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const book_title = req.params.title;

  let book_values = Object.values(books);

  let filteredByTitle = book_values.filter((val) => val.title.toLowerCase() === book_title.toLowerCase());

  return res.send(filteredByTitle);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  let book_values = Object.values(books);

  let getReviewsByISBN = (val) => {
    return books[val];
  }

  return res.send(getReviewsByISBN(isbn));
});

module.exports.general = public_users;
