require('dotenv').config()
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

async function registerUser(req, res) {
  //here we will get the data from the request body and check if the user already exists in the database, if not we will hash the password and create a new user in the database and return a token to the client
  const { username, email, password, role } = req.body;

  // Check if the user already exists in the database
  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  // If the user already exists, return a 409 status code with a message
  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  // If the user does not exist, hash the password and create a new user in the database
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
    role,
  })
    // After creating the user, generate a JWT token and return it to the client
    const token = jwt.sign({
        id: user._id,
        role:user.role,    
    }, process.env.JWT_SECRET)
    // Set the token in a cookie
    res.cookie("token", token)
    // Return a 201 status code with a message and the user data (excluding the password)
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role:user.role
            
        }
    })
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;
  const user = await userModel.findOne({
    $or: [
      { username },
      { email }
    
    ]
  })

  if (!user) {
    return res.status(401).json({
      mesage: "Invalid credentials"
    })
  }
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return res.status(401).json({
      mesage: "Invalid credentials"
    })
  }
  
  const token = jwt.sign({
    id: user._id,
    role: user.role
  }, process.env.JWT_SECRET)
  
  res.cookie("token", token)

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  })
  }
module.exports={registerUser, loginUser}