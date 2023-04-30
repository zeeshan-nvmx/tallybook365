const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema({
  mother_company: {
    type: String,
    required: [true, 'please provide a name'],
    unique: [true, 'a company with this name already exists, choose another one please.'],
  },
  company_remaining_amount: {
    type: Number,
    default: 0,
  },
  mother_company_logo: {
    type: String,
    default: '',
  },
  mother_company_image: {
    type: String,
    default: '',
  },
  mother_company_default_bank_account: {
    type: String,
    default: '',
  },
  mother_company_default_bank_name_address: {
    type: String,
    default: '',
  },
  mother_company_default_routing_no: {
    type: String,
    default: '',
  },
  mother_company_default_bank_routing_no: {
    type: String,
    default: '',
  },
})

module.exports = mongoose.model('Company', CompanySchema)