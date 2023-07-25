const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let book_list = require("./auth_users").bookList;


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  users.forEach(user => {
      if (user.username === username){
         return res.status(409).json({message: "Username is taken"});
      }
  })
  let add_user = new Object();
  add_user["username"] = username;
  add_user["password"] = password;
  users.push(add_user);
  return res.status(201).json({message: "Customer successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  string_book_list = JSON.stringify(book_list)
  return res.send(string_book_list);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_books = [];
  let length = Object.keys(books).length;
  for (let i = 1; i <= length; i++) {
    if(books[i].author === author){
        let add_book = new Object();
        add_book["isbn"] = i
        add_book["title"] = books[i].title
        add_book["reviews"] = books[i].reviews
        filtered_books.push(add_book);
    }
  }
  return res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_books = [];
  let length = Object.keys(books).length;
  for (let i = 1; i <= length; i++) {
    if(books[i].title === title){
        //create json object that includes isbn data, and excludes title
        let add_book = new Object();
        add_book["isbn"] = i
        add_book["author"] = books[i].author
        add_book["reviews"] = books[i].reviews
        filtered_books.push(add_book);
    }
  }
  return res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  return res.send(book_list[isbn].reviews);
});

module.exports.general = public_users;

