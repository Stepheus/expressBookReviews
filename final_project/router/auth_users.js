const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userWithSameName = users.filter((user)=> user.username === username);
    return userWithSameName.length > 0 ? false: true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUser = users.filter((user)=> {
        return (user.username === username && user.password === password)});
        return validUser.length > 0? true: false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  
  if(username && password){
    if (authenticatedUser(username,password)){
        let accessToken = jwt.sign({username}, "Harry Hogs Hogward", {expiresIn: 60*5});
        req.session.authorization = {accessToken};
        res.status(200).json({message: `${username} is logged in`});
    }else{
        res.status(404).json({message: "No user matching these credentials found."});
    }
  } else{
    res.status(404).json({message: "Pleaser enter a username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = parseInt(req.params.isbn);
    let newReview = req.query.review;
    let username = req.username;

    //changing book into a proper object for access wit
    // a custom function

    books[isbn].reviews[username] = newReview;
    res.status(200).send(JSON.stringify(books[isbn]));

  
});

regd_users.delete("/auth/review/:isbn", (req, res)=> {
    let isbn = parseInt(req.params.isbn);
    let username = req.username;
    delete books[isbn].reviews[username];
    res.status(200).send(JSON.stringify(books[isbn]));

})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
