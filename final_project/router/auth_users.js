const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let user = users.find(user => user.username === username);
  if (user) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{
  let validUser = users.find(user => 
    user.username === username && user.password === password
  );
  return validUser ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign(
      { data: username },
      "access",
      { expiresIn: 60 * 60 }   // 1 hour
    );

    return res.status(200).json({
      message: "User successfully logged in",
      token: accessToken
    });

  } else {
    return res.status(401).json({ message: "Invalid login details" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.body.username;   // since using curl directly

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added/modified",
    reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.body.username;   // passing via curl body

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review successfully deleted",
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
