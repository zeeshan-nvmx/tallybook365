const express = require("express")
const { createChalan, getAllChalans, getChalan, deleteChalan, updateChalan, getChalanSerialNumber } = require("../controllers/chalanController")
const { authenticateUser, authorizeUser} = require("../utils/authorize-authenticate")
const chalanRouter = express.Router()

chalanRouter.get('/chalans/getchalanserialnumber', authenticateUser, getChalanSerialNumber)
chalanRouter.post("/chalans", authenticateUser, createChalan)
chalanRouter.get("/chalans", authenticateUser, getAllChalans)
chalanRouter.get("/chalans/:id", authenticateUser, getChalan)
chalanRouter.delete("/chalans/:id", authenticateUser, authorizeUser('admin'), deleteChalan)
chalanRouter.patch("/chalans/:id", authenticateUser, updateChalan)

module.exports = chalanRouter
