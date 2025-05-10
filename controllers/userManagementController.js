// controllers/userManagementController.js
const User = require('../models/authModel')
const Company = require('../models/companyModel')
const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')
const { hashPassword } = require('../utils/password')
const { uploadToS3, deleteFromS3 } = require('../utils/s3')
const z = require('zod')
const { validateRequestFields, generateDefaultErrorMessage } = require('../utils/validations')

// For SASS Admin to create a company admin
async function createCompanyAdmin(req, res) {
  const { name, phone, email, password, mother_company, designation } = req.body

  // Validate required fields
  validateRequestFields(req.body, ['name', 'phone', 'email', 'password', 'mother_company', 'designation'])

  // Check if company exists
  const company = await Company.findOne({ mother_company })
  if (!company) {
    throw new BadRequestError("Company doesn't exist")
  }

  // Check if user already exists
  const userExists = await User.findOne({ phone })
  if (userExists) {
    throw new BadRequestError('User with this phone number is already signed up')
  }

  // Process profile image if provided
  let profile_image = ''
  if (req.files && req.files.profile_image) {
    profile_image = await uploadToS3(req.files.profile_image[0], null, {
      prefix: 'profile-images',
      metadata: { userId: phone },
    })
  }

  // Process signature if provided
  let signature = ''
  if (req.files && req.files.signature) {
    signature = await uploadToS3(req.files.signature[0], null, {
      prefix: 'signatures',
      metadata: { userId: phone },
    })
  }

  // Create user with admin role
  const hashedPassword = await hashPassword(password)
  const user = await User.create({
    name,
    phone,
    email,
    mother_company,
    role: 'admin',
    password: hashedPassword,
    company,
    designation,
    profile_image,
    signature,
  })

  res.status(201).json({
    msg: `New admin for company: ${mother_company} successfully created`,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      mother_company: user.mother_company,
      designation: user.designation,
      profile_image: user.profile_image,
      signature: user.signature,
    },
  })
}

// For Company Admin to create regular users
async function createCompanyUser(req, res) {
  const { name, phone, email, password, designation } = req.body
  const { mother_company } = req.user

  // Validate required fields
  validateRequestFields(req.body, ['name', 'phone', 'email', 'password', 'designation'])

  // Check if user already exists
  const userExists = await User.findOne({ phone })
  if (userExists) {
    throw new BadRequestError('User with this phone number is already signed up')
  }

  // Get company details
  const company = await Company.findOne({ mother_company })
  if (!company) {
    throw new BadRequestError("Company doesn't exist")
  }

  // Process profile image if provided
  let profile_image = ''
  if (req.files && req.files.profile_image) {
    profile_image = await uploadToS3(req.files.profile_image[0], null, {
      prefix: 'profile-images',
      metadata: { userId: phone },
    })
  }

  // Process signature if provided
  let signature = ''
  if (req.files && req.files.signature) {
    signature = await uploadToS3(req.files.signature[0], null, {
      prefix: 'signatures',
      metadata: { userId: phone },
    })
  }

  // Create regular user
  const hashedPassword = await hashPassword(password)
  const user = await User.create({
    name,
    phone,
    email,
    mother_company,
    role: 'user',
    password: hashedPassword,
    company,
    designation,
    profile_image,
    signature,
  })

  res.status(201).json({
    msg: `New user under company: ${mother_company} successfully created`,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      mother_company: user.mother_company,
      designation: user.designation,
      profile_image: user.profile_image,
      signature: user.signature,
    },
  })
}

// For any user to update their profile picture
async function updateProfileImage(req, res) {
  const { user_id } = req.user

  if (!req.file) {
    throw new BadRequestError('No image file provided')
  }

  // Get current user to retrieve old image URL
  const user = await User.findById(user_id)
  if (!user) {
    throw new NotFoundError('User not found')
  }

  // Delete old profile image if exists
  if (user.profile_image) {
    const oldImageKey = user.profile_image.split('/').pop()
    try {
      await deleteFromS3(oldImageKey)
    } catch (error) {
      console.error('Error deleting old profile image:', error)
    }
  }

  // Upload new profile image
  const profile_image = await uploadToS3(req.file, null, {
    prefix: 'profile-images',
    metadata: { userId: user.phone },
  })

  // Update user record
  const updatedUser = await User.findByIdAndUpdate(user_id, { profile_image }, { new: true })

  res.status(200).json({
    msg: 'Profile image updated successfully',
    profile_image: updatedUser.profile_image,
  })
}

// For any user to update their signature
async function updateSignature(req, res) {
  const { user_id } = req.user

  if (!req.file) {
    throw new BadRequestError('No signature file provided')
  }

  // Get current user to retrieve old signature URL
  const user = await User.findById(user_id)
  if (!user) {
    throw new NotFoundError('User not found')
  }

  // Delete old signature if exists
  if (user.signature) {
    const oldSignatureKey = user.signature.split('/').pop()
    try {
      await deleteFromS3(oldSignatureKey)
    } catch (error) {
      console.error('Error deleting old signature:', error)
    }
  }

  // Upload new signature
  const signature = await uploadToS3(req.file, null, {
    prefix: 'signatures',
    metadata: { userId: user.phone },
  })

  // Update user record
  const updatedUser = await User.findByIdAndUpdate(user_id, { signature }, { new: true })

  res.status(200).json({
    msg: 'Signature updated successfully',
    signature: updatedUser.signature,
  })
}

// Get users by company (for admins)
async function getUsersByCompany(req, res) {
  const { mother_company, role } = req.user

  if (role !== 'admin' && role !== 'sass-admin') {
    throw new UnauthorizedError('Not authorized to access user list')
  }

  const users = await User.find({ mother_company }).select('-password -otp -otpExpires')

  res.status(200).json(users)
}

module.exports = {
  createCompanyAdmin,
  createCompanyUser,
  updateProfileImage,
  updateSignature,
  getUsersByCompany,
}
