const mongoose = require("mongoose")

const purchaseOrderSchema = new mongoose.Schema(
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
    vendor_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'vendor id is missing.'],
    },
    vendor_name: {
      type: String,
      required: [true, 'vendor name is missing.'],
    },
    vendor_address: {
      type: String,
    },
    title: {
      type: String,
      required: [true, 'purchaseOrder title is missing.'],
    },
    job_no: {
      type: String,
      required: [true, 'job_no is missing.'],
    },
    brand: {
      type: String,
    },
    job_type: {
      type: String,
    },
    date: {
      type: Date,
      required: [true, 'date is missing.'],
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
      required: [true, 'grand total value is missing'],
    },
    sub_total: {
      type: Number,
      required: [true, 'sub total value is missing'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema)
