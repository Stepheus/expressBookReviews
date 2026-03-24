const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


function formatBook(data){
    data = JSON.stringify(data);
    data = JSON.parse(data);
    return data;
}

const isNumeric = (str)=>{
    return typeof str === "string" && Number.isFinite(+str);
};

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
    // return res.status(200).send(JSON.stringify({books},null, 4));

    //with promises
    let allBookPromise = new Promise((resolve, reject) => {
        if (books.length > 0){
            resolve();
        }else{
            reject(new Error("No books in the database."));
        }
    });
    
    allBookPromise.then(()=>{
        return res.status(200).send(JSON.stringify({books},null, 4));
    })
    .catch((error)=>{
        return res.status(500).json({message: error.message});
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;;
    if (!isNumeric(isbn)){
        return res.status(404).json({message: "Isbn value incorrect. Please enter an number."})
    }
    
     
    //Without Promise
    // let isbnBook = books[isbn];
//   return res.status(200).send(JSON.stringify(isbnBook));

  //With Promise
    let isbnPromise = new Promise((resolve, reject) => {     
        let isbnBook = books[isbn];
        if(isbnBook){
            resolve(isbnBook);
        }else{
            reject(new Error("Book with this isbn does not exist in the database"));
        }

  });

  isbnPromise.then((isbnBook)=>{
    res.status(200).json(isbnBook);
  })
  .catch((error)=>{
    res.status(404).json({message: error.message});
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const name = req.params.author;

    //formating the data for manipulation (A full Object)
    books = formatBook(books);

    //Without promise
//    let filteredBook = Object.fromEntries(Object.entries(books).filter(([key, value])=> value.author.toLowerCase() === name.toLowerCase()));
   
//     return res.status(200).send(JSON.stringify(filteredBook, null, 4));

    //With promise
    let authorPromise = new Promise((resolve, reject) => {
        let filteredBook = Object.fromEntries(Object.entries(books).filter(([key, value])=> value.author.toLowerCase() === name.toLowerCase()));
        if (Object.keys(filteredBook).length > 0){
            resolve(filteredBook);
        }else{
            reject(new Error("Author not find"));
        }
    });

    authorPromise.then((filteredBook)=>{
        return res.status(200).send(JSON.stringify(filteredBook, null, 4));
    })
    .catch((error)=> {
       return res.status(404).json({message: error.message});
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const name = req.params.title;
    books = formatBook(books); //objectify the book!

    //Without Promise
    // let filteredBook = Object.fromEntries(Object.entries(books).filter(([key, value])=> value.title.toLowerCase() === name.toLowerCase()));
    // return res.status(200).send(JSON.stringify(filteredBook, null, 4));

    //With Promise
    let titlePromise = new Promise((resolve, reject) => {
        let titleBooks = Object.fromEntries(Object.entries(books).filter(([key, value])=> value.title.toLowerCase() === name.toLowerCase()));
        if (Object.keys(titleBooks).length > 0){
            resolve(titleBooks);
        } else {
            reject(new Error("No book with this title found."));
        }
    });

    titlePromise.then((titleBooks)=>{
        return res.status(200).send(JSON.stringify(titleBooks, null, 4));
    })
    .catch((error)=>{
        return res.status(404).json({message: error.message});
    })

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
