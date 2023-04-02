const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema({
  client_id: {
    type: String,
    unique: true,
    required: [true, "user id is missing"],
  },
  client_name: {
    type: String,
    required: [true, "client name is missing"],
  },
  client_address: {
    type: String,
  },
  client_contact_no: {
    type: String,
    required: [true, "client contact no is missing"],
  },
  client_representitive1: {
    type: String,
    required: [true, "representitive is missing, atleast need to add one representative"],
  },
  client_representitive1_no: {
    type: String,
    required: [true, "representitive is missing, atleast need to add one representative contact no"],
  },
  client_representitive2: {
    type: String,
  },
  client_representitive2_no: {
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
