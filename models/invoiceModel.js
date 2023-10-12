const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'user id is missing.'],
    },
    quote_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Quote',
      required: [true, 'quote id is missing.'],
    },
    mother_company: {
      type: String,
      required: [true, 'mother company is missing.'],
    },
    client_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Client',
      required: [true, 'client id is missing.'],
    },
    client_name: {
      type: String,
      required: [true, 'client name is missing'],
    },
    client_address: {
      type: String,
    },
    title: {
      type: String,
      required: [true, 'invoice title is missing'],
    },
    brand: {
      type: String,
    },
    job_type: {
      type: String,
    },
    job_no: {
      type: String,
      required: [true, 'job_no is missing'],
    },
    date: {
      type: Date,
      required: [true, 'date is missing'],
      default: Date,
    },
    items: {
      type: Array,
      default: [],
    },
    vat: {
      type: Number,
      required: [true, 'vat is missing.'],
    },
    asf: {
      type: Number,
    },
    due: {
      type: Number,
      default: 0,
    },
    advance1: {
      type: Number,
      default: 0,
    },
    advance2: {
      type: Number,
      default: 0,
    },
    advance3: {
      type: Number,
      default: 0,
    },
    advance4: {
      type: Number,
      default: 0,
    },
    total_advance: {
      type: Number,
      default: 0,
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
      required: [true, 'grand total value is missing'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Invoice", invoiceSchema)
