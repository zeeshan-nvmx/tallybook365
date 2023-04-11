const express = require('express')
const { createCompany, getQuoteInvoiceSixMonthTotal } = require('../controllers/companyController')
const { authorizeUser, authenticateUser } = require('../utils/authorize-authenticate')
const companyRouter = express.Router()

companyRouter.post('/companies', authenticateUser, authorizeUser("sass-admin"), createCompany)
companyRouter.get('/companies/sixmonthtotal', authenticateUser, getQuoteInvoiceSixMonthTotal )

module.exports = companyRouter
