const express = require('express');
const axios = require('axios').default;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      return res.status(404).json({message: "Customer already exists"});
    } else {
      users.push({username: username, password: password});
      return res.status(200).json({message: "Customer registered successfully. Now you can login"});
    }
  } else {
    return res.status(404).json({message: "Unable to register customer"});
  }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get("booksdb");
    const books = response.data;
    return res.send(JSON.stringify({books}, null, 4));
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = parseInt(req.params.isbn);
    const response = await axios.get("booksdb");
    let books = response.data;
    return res.status(200).json(books[isbn]);
  } catch (error) {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booklist = [];
  for (let [key, value] of Object.entries(books)) {
    if (value.author === author) {
      booklist.push(value);
    }
  }
  if (booklist.length > 0) {
    return res.status(200).json({booklist}, null, 4);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booklist = [];
  for (let [key, value] of Object.entries(books)) {
    if (value.title === title) {
      booklist.push(value);
    }
  }
  if (booklist.length > 0) {
    return res.status(200).json({booklist}, null, 4);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  let book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
