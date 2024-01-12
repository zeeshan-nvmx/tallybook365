/*

const BadRequestError = require('../errors/bad-request');
const User = require('../models/authModel');
const Company = require('../models/companyModel')
// const attachCookies = require('../utils/cookies');
const { createJWT } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/password')

async function register(req, res) {
  const { name, phone, email, password, mother_company, role, designation, profile_image, signature } = req.body;
  
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
  const user = await User.create({ name, phone, email, mother_company, role, password: hashedPassword, company, designation, profile_image, signature }); 
  
  const tokenUser = { user_id: user._id, name: user.name, phone: user.phone, role: user.role, email: user.email, designation: user.designation, profile_image: user.profile_image, signature: user.signature, mother_company: user.mother_company, company }; 
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

  const tokenUser = { user_id: storedUser._id, name: storedUser.name, phone: storedUser.phone, role: storedUser.role, mother_company: storedUser.mother_company, email: storedUser.email, company, profile_image: storedUser.profile_image, signature: storedUser.signature, designation: storedUser.designation };
  
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

*/

const axios = require('axios')
const z = require('zod')
const BadRequestError = require('../errors/bad-request')
const User = require('../models/authModel')
const Company = require('../models/companyModel')
const { createJWT } = require('../utils/jwt')
const { hashPassword, comparePassword } = require('../utils/password')

// Zod Schemas
const userSchema = z.object({
  name: z.string().min(1, 'Please provide a name'),
  phone: z.string().min(11, 'Phone number should be at least 11 digits'),
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(6, 'Password should be at least 6 characters long'),
  mother_company: z.string().optional(),
  role: z.enum(['sass-admin', 'admin', 'user']).optional(),
  signature: z.string().optional(),
  profile_image: z.string().optional(),
  designation: z.string().optional(),
})

const loginSchema = z.object({
  phone: z.string().min(11, 'Phone number should be at least 11 digits'),
  password: z.string().min(6, 'Password should be at least 6 characters long'),
})

const resetPasswordRequestSchema = z.object({
  phone: z.string().min(11, 'Phone number should be at least 11 digits'),
})

const validateOTPAndResetPasswordSchema = z.object({
  phone: z.string().min(11, 'Phone number should be at least 11 digits'),
  otp: z.string().length(4, 'OTP should be 4 digits'),
  newPassword: z.string().min(6, 'Password should be at least 6 characters long'),
})

// Controller Functions
async function register(req, res) {
  const validationResult = userSchema.safeParse(req.body)
  if (!validationResult.success) {
    throw new BadRequestError(validationResult.error.message)
  }

  const { name, phone, email, password, mother_company, role, designation, profile_image, signature } = validationResult.data

  const userExists = await User.findOne({ phone })
  if (userExists) {
    throw new BadRequestError('User with this phone number is already signed up')
  }

  const company = await Company.findOne({ mother_company })
  if (!company) {
    throw new BadRequestError("Company doesn't exist")
  }

  const hashedPassword = await hashPassword(password)
  const user = await User.create({
    name,
    phone,
    email,
    mother_company,
    role,
    password: hashedPassword,
    company,
    designation,
    profile_image,
    signature,
  })

  const tokenUser = { user_id: user._id, name, phone, role, email, designation, profile_image, signature, mother_company, company }
  const token = await createJWT(tokenUser)
  res.status(201).json({ token, msg: `New user under company: ${user.mother_company} successfully registered`, user: tokenUser })
}

async function login(req, res) {
  const validationResult = loginSchema.safeParse(req.body)
  if (!validationResult.success) {
    throw new BadRequestError(validationResult.error.message)
  }

  const { phone, password } = validationResult.data
  const storedUser = await User.findOne({ phone })
  if (!storedUser) {
    throw new BadRequestError("User with this phone doesn't exist")
  }

  const isPasswordCorrect = await comparePassword(password, storedUser.password)
  if (!isPasswordCorrect) {
    throw new BadRequestError('Invalid credentials')
  }

  const tokenUser = { user_id: storedUser._id, name: storedUser.name, phone: storedUser.phone, role: storedUser.role, email: storedUser.email }
  const token = await createJWT(tokenUser)
  res.status(200).json({ token, msg: `User: ${storedUser.name} successfully logged in`, user: tokenUser })
}

async function logout(req, res) {
  res.status(200).json({ msg: 'Successfully logged out' })
}

async function requestPasswordReset(req, res) {
  const validationResult = resetPasswordRequestSchema.safeParse(req.body)
  if (!validationResult.success) {
    throw new BadRequestError(validationResult.error.message)
  }

  const { phone } = validationResult.data
  const user = await User.findOne({ phone })
  if (!user) {
    throw new BadRequestError('User not found')
  }

  const otp =  Math.floor(1000 + Math.random() * 9000) // 4 digit OTP
  const otpExpires = new Date(Date.now() + 10 * 60000)

  await User.findOneAndUpdate({ phone }, { otp, otpExpires })

  const greenwebsms = new URLSearchParams()
  greenwebsms.append('token', process.env.BDBULKSMS_TOKEN)
  greenwebsms.append('to', phone)
  greenwebsms.append('message', `Your OTP for tallybook365 password reset is ${otp}`)

  try {
    await axios.post('http://api.greenweb.com.bd/api.php', greenwebsms)
    res.status(200).json({ msg: 'OTP sent to your phone' })
  } catch (error) {
    console.error(error)
    throw new BadRequestError('Failed to send OTP')
  }
}

async function validateOTPAndResetPassword(req, res) {
  const validationResult = validateOTPAndResetPasswordSchema.safeParse(req.body)
  if (!validationResult.success) {
    throw new BadRequestError(validationResult.error.message)
  }

  const { phone, otp, newPassword } = validationResult.data
  const user = await User.findOne({ phone, otp, otpExpires: { $gt: Date.now() } })
  if (!user) {
    throw new BadRequestError('Invalid OTP or it has expired')
  }

  const hashedPassword = await hashPassword(newPassword)
  await User.findOneAndUpdate({ phone }, { password: hashedPassword, otp: null, otpExpires: null })

  res.status(200).json({ msg: 'Password has been reset successfully' })
}

module.exports = { register, login, logout, requestPasswordReset, validateOTPAndResetPassword }
