const BadRequestError = require('../errors/bad-request');
const User = require('../models/authModel');
// const attachCookies = require('../utils/cookies');
const { createJWT } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/password')

async function register(req, res) {
  const { name, email, password, mother_company } = req.body;
  
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new BadRequestError('User with this email is already signed up')
  }
  
  if (!name || !password || !email) {
    throw new BadRequestError("please provide all necessary fields")
  }

  const hashedPassword = await hashPassword(password); 
  const user = await User.create({ name, email, mother_company, password: hashedPassword }); 
  
  const tokenUser = { name: user.name, role: user.role, email: user.email, mother_company: user.mother_company, user_id: user._id }; 
  const token = await createJWT(tokenUser);
  // await attachCookies(res, token)
  res.status(201).json({ token, msg: `New user under company: ${user.mother_company} successfully registered`, user: tokenUser }); 
}

async function login(req, res) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new BadRequestError("please provide all necessary fields")
  }

  const storedUser = await User.findOne({ email });
  console.log(storedUser);
  if (!storedUser) {
    throw new BadRequestError("user with this email doesn't exist")
  }

  const tokenUser = { user_id: storedUser._id, name: storedUser.name, role: storedUser.role, mother_company: storedUser.mother_company, email: storedUser.email };
  console.log(tokenUser);
  const isPasswordCorrect = await comparePassword(password, storedUser.password);

  if (isPasswordCorrect) {
    const token = await createJWT(tokenUser);
    // await attachCookies(res,token)
    return res.status(201).json({ token, msg: `user: ${storedUser.name} successfully logged in`, user: tokenUser});
  } else {
    return res.status(401).json({ msg: 'your email or password is incorrect, please kindly check credentials before trying again' });
  }
}

async function logout(req, res) {
  // res.cookie('authToken', 'loggedout', {expires: new Date(Date.now())})
  res.status(200).json({ msg: `user: ${storedUser.name} successfully logged out` });
}

module.exports = {register,login,logout}
