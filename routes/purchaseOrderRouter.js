const express = require("express")
const { createPurchaseOrder, getAllPurchaseOrders, getPurchaseOrder, deletePurchaseOrder, updatePurchaseOrder, getPurchaseOrderSerialNumber } = require("../controllers/purchaseOrderController")
const { authenticateUser } = require('../utils/authorize-authenticate')
const purchaseOrderRouter = express.Router()

purchaseOrderRouter.get('/purchaseorders/getpurchaseorderserialnumber', authenticateUser, getPurchaseOrderSerialNumber)
purchaseOrderRouter.post('/purchaseorders', authenticateUser, createPurchaseOrder)
purchaseOrderRouter.get('/purchaseorders', authenticateUser, getAllPurchaseOrders)
purchaseOrderRouter.get('/purchaseorders/:id', authenticateUser, getPurchaseOrder)
purchaseOrderRouter.delete('/purchaseorders/:id', authenticateUser, deletePurchaseOrder)
purchaseOrderRouter.patch('/purchasekorders/:id', authenticateUser, updatePurchaseOrder)

module.exports = purchaseOrderRouter
