const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  users.forEach(user => {
      if(user.username === username && user.password === password) {
        let accessToken = jwt.sign({
            data: password
          }, 'access', { expiresIn: 60 * 60 });
          req.session.authorization = {
            accessToken,username
        }
          return res.status(201).json({message: "Customer successfully logged in"})
      }
  })
  return res.status(409).json({message: "Username or password invalid"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.send(req.session.authorization);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
