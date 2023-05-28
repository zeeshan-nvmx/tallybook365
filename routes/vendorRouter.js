const express = require('express')
const { createVendor, getAllVendors, getVendor, updateVendor, deleteVendor } = require('../controllers/vendorController')
const { authenticateUser, authorizeUser } = require('../utils/authorize-authenticate')
const vendorRouter = express.Router()

vendorRouter.post('/vendors', authenticateUser, createVendor)
vendorRouter.get('/vendors', authenticateUser, getAllVendors)
vendorRouter.get('/vendors/:id', authenticateUser, getVendor)
vendorRouter.delete('/vendors/:id', authenticateUser, authorizeUser('admin'), deleteVendor)
vendorRouter.patch('/vendors/:id', authenticateUser, updateVendor)

module.exports = vendorRouter
