const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let fitered_user = users.filter(user => user.username === username);
  if (fitered_user.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  let validUsers = users.filter(user => user.username === username && user.password === password);
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Unable to login"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, "access", { expiresIn: 7 * 60 });

    req.session.authorization = { accessToken, username };
    res.status(200).json({ message: "Customer Successfully logged in" })
  } else {
    res.status(404).json({ message: "Unable to login. Check your username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const review = req.body.review;

  if (books[isbn]) {
    books[isbn].reviews = {review};
    return res.status(200).json({ message: `The review for the book with ISBN ${isbn} is added/updated.` });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);

  if (books[isbn]) {
    books[isbn].reviews = {};
    return res.status(200).json({ message: `The review for the book with ISBN ${isbn} is deleted` });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
