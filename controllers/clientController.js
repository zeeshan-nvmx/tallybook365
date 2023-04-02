const Client = require("../models/clientModel")
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");

async function createClient(req, res) {
  const {
    mother_company,
    client_name,
    client_address,
    client_contact_no,
    client_representative1,
    client_representative1_no,
    client_representative2,
    client_representative2_no,
    bank_account,
    bank_name_address,
    swift,
    routing_no,
  } = req.body

  const client = await Client.create({
    mother_company,
    client_name,
    client_address,
    client_contact_no,
    client_representative1,
    client_representative1_no,
    client_representative2,
    client_representative2_no,
    bank_account,
    bank_name_address,
    swift,
    routing_no,
  })

  console.log(client)

  if (client) {
    return res.status(201).json({ msg: "client inserted", data: client })
  } else {
    throw new BadRequestError("failed to create new client, try again")
  }
}

async function getAllClients(req, res) {

  const userExtractedCompany = req.user.company

    const clients = await Client.find({ mother_company: userExtractedCompany })
    if (clients) {
      return res.status(200).json(clients)
    }
    throw new NotFoundError("clients not found")

}

async function getClient(req, res) {
  const { id } = req.params
  const userExtractedCompany = req.user.company
  console.log(typeof id)
  const client = await Client.findOne({ _id: id, mother_company: userExtractedCompany })
  
  if (client) {
    return res.status(200).json(client)
  }
  throw new NotFoundError("client with particular id not found")
}

async function updateClient(req, res) {
  const { id } = req.params
  const userExtractedCompany = req.user.company
  const client = await Client.findOneAndUpdate({ _id: id, mother_company: userExtractedCompany }, req.body, { new: true })

  if (client) {
    return res.status(200).json({ msg: "client successfully updated", data: client })
  }
  throw new BadRequestError("couldn't update client, sorry :(")
}

async function deleteClient(req, res) {
  const { id } = req.params
  const userExtractedCompany = req.user.company
  console.log(typeof id)
  const client = await Client.findOneAndDelete({ _id: id, mother_company: userExtractedCompany })

  if (client) {
    return res.status(200).json({ msg: "client deleted", data: client })
  }
  throw new NotFoundError("client with particular id was not found")
}

module.exports = { createClient, getAllClients, getClient,  updateClient, deleteClient  }