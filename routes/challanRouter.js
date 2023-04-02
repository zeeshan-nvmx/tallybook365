const express = require("express")
const { createChallan, getAllChallans, getChallan, deleteChallan, updateChallan } = require("../controllers/challanController")
const { authenticateUser} = require("../utils/authorize-authenticate")
const challanRouter = express.Router()

challanRouter.post("/challans", authenticateUser, createChallan)
challanRouter.get("/challans", authenticateUser, getAllChallans)
challanRouter.get("/challans/:id", authenticateUser, getChallan)
challanRouter.delete("/challans/:id", authenticateUser, deleteChallan)
challanRouter.patch("/challans/:id", authenticateUser, updateChallan)

module.exports = challanRouter
