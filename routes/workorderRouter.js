const express = require("express")
const { createWorkOrder, getAllWorkOrders, getWorkOrder, deleteWorkOrder, updateWorkOrder } = require("../controllers/workorderController")
const { authenticateUser } = require('../utils/authorize-authenticate')
const workorderRouter = express.Router()

workorderRouter.post("/workorders", authenticateUser, createWorkOrder)
workorderRouter.get("/workorders", authenticateUser, getAllWorkOrders)
workorderRouter.get("/workorders/:id", authenticateUser, getWorkOrder)
workorderRouter.delete("/workorders/:id", authenticateUser, deleteWorkOrder)
workorderRouter.patch("/workorders/:id", authenticateUser, updateWorkOrder)

module.exports = workorderRouter
