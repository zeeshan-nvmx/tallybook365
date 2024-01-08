const BadRequestError = require('../errors/bad-request');
const User = require('../models/authModel');
const Company = require('../models/companyModel')
// const attachCookies = require('../utils/cookies');
const { createJWT } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/password')

async function register(req, res) {
  const { name, phone, email, password, mother_company, role } = req.body;
  
  const userExists = await User.findOne({ phone })
  if (userExists) {
    throw new BadRequestError('User with this phone number is already signed up')
  }
  
  if (!name || !password || !phone) {
    throw new BadRequestError("please provide all necessary fields")
  }

  const company = await Company.findOne({ mother_company })
  
  console.log(company)
  if (!company) {
    throw new BadRequestError("company doesn't exist")
  }

  const hashedPassword = await hashPassword(password); 
  const user = await User.create({ name, phone, email, mother_company, role, password: hashedPassword, company }); 
  
  const tokenUser = { user_id: user._id, name: user.name, phone: user.phone, role: user.role, email: user.email, mother_company: user.mother_company, company }; 
  const token = await createJWT(tokenUser);
  // await attachCookies(res, token)
  res.status(201).json({ token, msg: `New user under company: ${user.mother_company} successfully registered`, user: tokenUser }); 
}

async function login(req, res) {
  const { phone, password } = req.body;
  
  if (!phone || !password) {
    throw new BadRequestError("please provide all necessary fields")
  }

  const storedUser = await User.findOne({ phone });
  if (!storedUser) {
    throw new BadRequestError("user with this phone doesn't exist")
  }

  const mother_company = storedUser.mother_company
  const company = await Company.findOne({ mother_company })

  if (!company) {
    throw new BadRequestError("company doesn't exist")
  }

  const tokenUser = { user_id: storedUser._id, name: storedUser.name, phone: storedUser.phone, role: storedUser.role, mother_company: storedUser.mother_company, email: storedUser.email, company, profile_image: storedUser.profile_image, signature: storedUser.signature };
  console.log(tokenUser);
  const isPasswordCorrect = await comparePassword(password, storedUser.password);

  if (isPasswordCorrect) {
    const token = await createJWT(tokenUser);
    // await attachCookies(res,token)
    return res.status(201).json({ token, msg: `user: ${storedUser.name} successfully logged in`, user: tokenUser});
  } else {
    return res.status(401).json({ msg: 'your phone number or password is incorrect, please kindly check credentials before trying again' });
  }
}

async function logout(req, res) {
  // res.cookie('authToken', 'loggedout', {expires: new Date(Date.now())})
  res.status(200).json({ msg: `user: ${storedUser.name} successfully logged out` });
}

module.exports = {register,login,logout}
