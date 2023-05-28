const Vendor = require('../models/vendorModel')
const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')

async function createVendor(req, res) {
  const {
    mother_company,
    vendor_name,
    vendor_address,
    vendor_contact_no,
    vendor_representative1,
    vendor_representative1_no,
    vendor_representative2,
    vendor_representative2_no,
    bank_account,
    bank_name_address,
    swift,
    routing_no,
  } = req.body

  const vendor = await Vendor.create({
    mother_company,
    vendor_name,
    vendor_address,
    vendor_contact_no,
    vendor_representative1,
    vendor_representative1_no,
    vendor_representative2,
    vendor_representative2_no,
    bank_account,
    bank_name_address,
    swift,
    routing_no,
  })

  if (vendor) {
    return res.status(201).json({ msg: 'vendor inserted', data: vendor })
  } else {
    throw new BadRequestError('failed to create new vendor, try again')
  }
}

async function getAllVendors(req, res) {
  const userExtractedCompany = req.user.mother_company

  const vendors = await Vendor.find({ mother_company: userExtractedCompany })
  if (vendors) {
    return res.status(200).json(vendors)
  }
  throw new NotFoundError('vendors not found')
}

async function getVendor(req, res) {
  const { id } = req.params
  const userExtractedCompany = req.user.mother_company
  console.log(typeof id)
  const vendor = await Vendor.findOne({ _id: id, mother_company: userExtractedCompany })

  if (vendor) {
    return res.status(200).json(vendor)
  }
  throw new NotFoundError('vendor with particular id not found')
}

async function updateVendor(req, res) {
  const { id } = req.params
  const userExtractedCompany = req.user.mother_company
  const vendor = await Vendor.findOneAndUpdate({ _id: id, mother_company: userExtractedCompany }, req.body, { new: true })

  if (vendor) {
    return res.status(200).json({ msg: 'vendor successfully updated', data: vendor })
  }
  throw new BadRequestError("couldn't update vendor, sorry :(")
}

async function deleteVendor(req, res) {
  const { id } = req.params
  const userExtractedCompany = req.user.mother_company
  console.log(typeof id)
  const vendor = await Vendor.findOneAndDelete({ _id: id, mother_company: userExtractedCompany })

  if (vendor) {
    return res.status(200).json({ msg: 'vendor deleted', data: vendor })
  }
  throw new NotFoundError('vendor with particular id was not found')
}

module.exports = { createVendor, getAllVendors, getVendor, updateVendor, deleteVendor }
