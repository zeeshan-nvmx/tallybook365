const express = require('express')
const { createCompany, getQuoteInvoiceSixMonthTotal, getCurrentMonthInvoiceTotal, getCurrentMonthQuoteTotal } = require('../controllers/companyController')
const { authorizeUser, authenticateUser } = require('../utils/authorize-authenticate')
const companyRouter = express.Router()

companyRouter.post('/companies', authenticateUser, authorizeUser("sass-admin"), createCompany)
companyRouter.get('/companies/sixmonthtotal', authenticateUser, getQuoteInvoiceSixMonthTotal)
companyRouter.get('/companies/currentmonthquoted', authenticateUser, getCurrentMonthQuoteTotal)
companyRouter.get('/companies/currentmonthinvoiced', authenticateUser, getCurrentMonthInvoiceTotal)

module.exports = companyRouter
