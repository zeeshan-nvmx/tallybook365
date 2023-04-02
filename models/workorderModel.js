const mongoose = require("mongoose")

const workorderSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "user id is missing."],
  },
  client_id: {
    type: String,
    required: [true, "client id is missing."],
  },
  client_name: {
    type: String,
    required: [true, "client name is missing."],
  },
  client_address: {
    type: String,
  },
  title: {
    type: String,
    required: [true, "workorder title is missing."],
  },
  job_no: {
    type: Number,
    unique: true,
    required: [true, "job_no is missing."],
  },
  brand: {
    type: String,
  },
  job_type: {
    type: String,
  },
  date: {
    type: Date,
    required: [true, "date is missing."],
    default: Date,
  },
  items: {
    type: Array,
    default: [],
  },
  vat: {
    type: Number,
  },
  asf: {
    type: Number,
  },
  t_and_c: {
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
  grand_total: {
    type: Number,
    required: [true, "grand total value is missing"],
  },
})

module.exports = mongoose.model("WorkOrder", workorderSchema)
