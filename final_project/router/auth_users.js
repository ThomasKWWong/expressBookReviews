const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let book_list = JSON.parse(JSON.stringify(books));
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
  let username = req.session.authorization.username;
  let review_contents = req.query.review;
  let isbn = req.params.isbn;

  book_list[isbn].reviews[username] = review_contents;
  return res.status(201).json({message: "The review for this book with ISBN " + isbn + " has been added/updated"})
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization.username;

    //check review exists under username
    if (book_list[isbn].reviews.hasOwnProperty(username)){
        delete book_list[isbn].reviews[username];
        return res.status(200).json({message: "Reviews for the ISBN " + isbn + " posted by the user " + username+ " deleted"})
    }

    return res.status(404).json({message: "Review doesn't exist"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.bookList = book_list;
