const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});


// Get all books (using async/await)
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});


// Get book by ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(books[isbn]);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});


// Get books by author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);

    let filteredBooks = Object.entries(books)
      .filter(([key, value]) => value.author === author)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    return res.status(200).json(filteredBooks);

  } catch (error) {
    return res.status(404).json({ message: "Author not found" });
  }
});


// Get books by title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);

    let filteredBooks = Object.entries(books)
      .filter(([key, value]) => value.title === title)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    return res.status(200).json(filteredBooks);

  } catch (error) {
    return res.status(404).json({ message: "Title not found" });
  }
});


// Get review by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
