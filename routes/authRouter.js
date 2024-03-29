const express = require('express')
const { register, login, logout, requestPasswordReset, validateOTPAndResetPassword } = require('../controllers/authController')
const { authenticateUser, authorizeUser } = require('../utils/authorize-authenticate')
const authRouter = express.Router()

authRouter.post('/register', authenticateUser,  authorizeUser("sass-admin", "admin") , register)
authRouter.post('/login', login)

authRouter.post('/request-otp', requestPasswordReset)
authRouter.post('/reset-password', validateOTPAndResetPassword)

authRouter.get('/logout', logout)

module.exports = authRouter