const express = require("express")
const {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrder,
  deletePurchaseOrder,
  updatePurchaseOrder,
  getPurchaseOrderSerialNumber,
  getPurchaseOrdersByQuote,
} = require('../controllers/purchaseOrderController')
const { authenticateUser } = require('../utils/authorize-authenticate')
const purchaseOrderRouter = express.Router()

purchaseOrderRouter.get('/purchaseorders/getpurchaseorderserialnumber', authenticateUser, getPurchaseOrderSerialNumber)
purchaseOrderRouter.post('/purchaseorders', authenticateUser, createPurchaseOrder)
purchaseOrderRouter.post('/purchaseorders/getpurchaseordersbyquote', authenticateUser, getPurchaseOrdersByQuote)
purchaseOrderRouter.get('/purchaseorders', authenticateUser, getAllPurchaseOrders)
purchaseOrderRouter.get('/purchaseorders/:id', authenticateUser, getPurchaseOrder)
purchaseOrderRouter.delete('/purchaseorders/:id', authenticateUser, deletePurchaseOrder)
purchaseOrderRouter.patch('/purchaseorders/:id', authenticateUser, updatePurchaseOrder)

module.exports = purchaseOrderRouter
