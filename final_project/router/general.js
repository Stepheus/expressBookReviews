const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();


function formatBook(data){
    data = JSON.stringify(data);
    data = JSON.parse(data);
    return data;
}

public_users.post("/register", (req,res) => {
  //Register as user 
  const {username, password} = req.body;
  if (username && password){
    if (isValid(username)){
        users.push({username, password});
        res.status(200).json({message: `user: ${username} has been successfully added.`});
      } else {
        res.status(404).json({message: `username: ${username} already exists.`});}
  } else{
    res.status(404).json({message: "Please enter a username and password"});}
  });


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Without promise
    return res.status(200).send(JSON.stringify({books},null, 4));
    // try {
    //     let response = await apiClient.get('router/booksdb.js');
    //     res.status(200).json({data: response.data});
        
    // } catch (error) {
    //     res.status(404).json({error: error});      
    // }
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let isbnBook = books[isbn];
  return res.status(200).send(JSON.stringify(isbnBook));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const name = req.params.author;

    //formating the data for manipulation
    books = formatBook(books);

    //accessing value needed
   let filteredBook = Object.fromEntries(Object.entries(books).filter(([key, value])=> value.author.toLowerCase() === name.toLowerCase()));

   
    return res.status(200).send(JSON.stringify(filteredBook, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const name = req.params.title;
    books = formatBook(books);
    let filteredBook = Object.fromEntries(Object.entries(books).filter(([key, value])=> value.title.toLowerCase() === name.toLowerCase()));
    return res.status(200).send(JSON.stringify(filteredBook, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
