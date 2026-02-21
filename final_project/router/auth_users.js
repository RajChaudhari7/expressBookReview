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

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
