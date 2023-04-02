const express = require("express")
const { createClient, getAllClients, getClient, updateClient, deleteClient } = require("../controllers/clientController")
const { authenticateUser} = require('../utils/authorize-authenticate')
const clientRouter = express.Router()

clientRouter.post("/clients", authenticateUser, createClient)
clientRouter.get("/clients", authenticateUser, getAllClients)
clientRouter.get("/clients/:id", authenticateUser, getClient)
clientRouter.delete("/clients/:id", authenticateUser, deleteClient)
clientRouter.patch("/clients/:id",authenticateUser, updateClient)

module.exports = clientRouter