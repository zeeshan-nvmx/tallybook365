// routes/userManagementRouter.js
const express = require('express')
const { authenticateUser, authorizeUser } = require('../utils/authorize-authenticate')
const { upload } = require('../middleware/uploadMiddleware')
const { createCompanyAdmin, createCompanyUser, updateProfileImage, updateSignature, getUsersByCompany } = require('../controllers/userManagementController')

const userManagementRouter = express.Router()

// Routes for SASS Admin
userManagementRouter.post(
  '/company-admins',
  authenticateUser,
  authorizeUser('sass-admin'),
  upload.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
  ]),
  createCompanyAdmin
)

// Routes for Company Admin
userManagementRouter.post(
  '/company-users',
  authenticateUser,
  authorizeUser('admin'),
  upload.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
  ]),
  createCompanyUser
)

// Routes for all authenticated users
userManagementRouter.put('/profile-image', authenticateUser, upload.single('profile_image'), updateProfileImage)

userManagementRouter.put('/signature', authenticateUser, upload.single('signature'), updateSignature)

// Route for admins to get users by company
userManagementRouter.get('/company-users', authenticateUser, authorizeUser('admin', 'sass-admin'), getUsersByCompany)

module.exports = userManagementRouter
