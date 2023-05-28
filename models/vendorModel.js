const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
  mother_company: {
    type: String,
    required: true,
  },
  vendor_name: {
    type: String,
    required: [true, 'vendor name is missing'],
  },
  vendor_address: {
    type: String,
  },
  vendor_contact_no: {
    type: String,
    required: [true, 'vendor contact no is missing'],
  },
  vendor_representative1: {
    type: String,
    required: [true, 'representative is missing, atleast need to add one representative'],
  },
  vendor_representative1_no: {
    type: String,
    required: [true, 'representative is missing, atleast need to add one representative contact no'],
  },
  vendor_representative2: {
    type: String,
  },
  vendor_representative2_no: {
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

module.exports = mongoose.model('Vendor', vendorSchema)
