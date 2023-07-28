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
public_users.get('/',async function (req, res) {
  try {
    let string_book_list = await new Promise((resolve, reject) => {
        resolve(JSON.stringify(book_list, null, 4));
    })
    return res.send(string_book_list);
  }
  catch(err) {
      return res.status(500).send({message: "failed to retrieve book list"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  try {
    let book_promise = await new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(book_list[isbn], null, 4);
    })
    return res.send(book_promise);
  }
  catch (err) {
    return res.status(500).send({message: "failed to retrieve book by ISPN"});
  }
  
  
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  try {
    let book_promise = await new Promise((resolve, reject) => {
        const author = req.params.author;
        let filtered_books = [];
        let length = Object.keys(book_list).length;
        for (let i = 1; i <= length; i++) {
            if(book_list[i].author === author){
                let add_book = new Object();
                add_book["isbn"] = i
                add_book["title"] = book_list[i].title
                add_book["reviews"] = book_list[i].reviews
                filtered_books.push(add_book);
            }
        }
        resolve(filtered_books, null, 4);
    })
    return res.send(book_promise);
  }
  catch (err) {
    return res.status(500).send({message: "failed to retrieve book by Author"});
  }
  
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  try{
    let book_promise = await new Promise((resolve, reject) => {
        const title = req.params.title;
        let filtered_books = [];
        let length = Object.keys(book_list).length;
        for (let i = 1; i <= length; i++) {
            if(book_list[i].title === title){
                //create json object that includes isbn data, and excludes title
                let add_book = new Object();
                add_book["isbn"] = i
                add_book["author"] = book_list[i].author
                add_book["reviews"] = book_list[i].reviews
                filtered_books.push(add_book);
            }
        }
        resolve(filtered_books, null, 4);
    });
    return res.send(book_promise);
  }
  catch (err) {
    return res.status(500).send({message: "failed to retrieve book by Title"});
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  return res.send(book_list[isbn].reviews);
});

module.exports.general = public_users;

