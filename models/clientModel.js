const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema(
  {
    mother_company: {
      type: String,
      required: true,
    },
    client_name: {
      type: String,
      required: [true, 'client name is missing'],
    },
    client_address: {
      type: String,
    },
    client_contact_no: {
      type: String,
      required: [true, 'client contact no is missing'],
    },
    client_representative1: {
      type: String,
      required: [true, 'representative is missing, atleast need to add one representative'],
    },
    client_representative1_no: {
      type: String,
      required: [true, 'representative is missing, atleast need to add one representative contact no'],
    },
    client_representative2: {
      type: String,
    },
    client_representative2_no: {
      type: String,
    },
    bank_account: {
      type: String,
    },
    bank_name_address: {
      type: String,
    },
    swift: {
      type: String,
    },
    routing_no: {
      type: String,
    },
  })

module.exports = mongoose.model("Client", clientSchema)
