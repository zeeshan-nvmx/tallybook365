const BadRequestError = require("../errors/bad-request")
const NotFoundError = require("../errors/not-found")
const Chalan = require("../models/chalanModel")
const Quote = require("../models/quoteModel")

async function createChalan(req, res) {
  const {
    user_id,
    quote_id,
    mother_company,
    client_id,
    client_name,
    client_address,
    title,
    job_no,
    date,
    items,
    vat,
    asf,
    t_and_c,
    bank_account,
    bank_name_address,
    swift,
    routing_no,
    brand,
    job_type,
    grand_total,
  } = req.body

  const chalan = await Chalan.create({
    user_id,
    quote_id,
    mother_company,
    client_id,
    client_name,
    client_address,
    title,
    job_no,
    date,
    items,
    vat,
    asf,
    t_and_c,
    bank_account,
    bank_name_address,
    swift,
    routing_no,
    brand,
    job_type,
    grand_total,
  })

  if (chalan) {
    console.log(chalan)
    const quote = await Quote.findOneAndUpdate({ _id: quote_id }, { chalan_id: chalan._id })
    if (quote) {
      return res.status(201).json({ msg: 'chalan successfully created', data: chalan })
    } else {
      await chalan.findOneAndDelete({ _id: chalan._id })
      throw new NotFoundError(`quote with ${quote_id} not found, so chalan is being deleted`)
    }
    
  } else {
    throw new BadRequestError("failed to create new chalan, try again")
  }
}

async function getAllChalans(req, res) {
  const { user_id, role, mother_company } = req.user

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 30
  const skip = (page - 1) * limit

  if (role === "admin") {
    const chalans = await Chalan.find({mother_company: mother_company}).sort("-date").skip(skip).limit(limit)
    console.log(chalans)
    if (chalans) {
      return res.status(200).json(chalans)
    }
    throw new NotFoundError(`chalans not found ( role is ${role})`)
  }

  if (role === "user") {
    const chalans = await Chalan.find({ user_id: user_id, mother_company: mother_company }).sort('-date').skip(skip).limit(limit)
    if (chalans) {
      return res.status(200).json(chalans)
    }
    throw new NotFoundError(`chalans not found ( role is ${role})`)
  }
}

async function getChalan(req, res) {
  const { id } = req.params
  console.log(typeof id)
  const chalan = await Chalan.findOne({ _id: id, mother_company: mother_company })
  console.log(chalan)
  if (chalan) {
    return res.status(200).json(chalan)
  }
  throw new NotFoundError("chalan with particular id not found")
}

async function updateChalan(req, res) {
  const { id } = req.params

  const {mother_company} = req.user

  const chalan = await Chalan.findOneAndUpdate({ _id: id, mother_company: mother_company }, req.body, { new: true })

  if (chalan) {
    return res.status(200).json({ msg: "chalan successfully updated", data: chalan })
  }
  throw new BadRequestError("couldn't update chalan, sorry :(")
}

async function deleteChalan(req, res) {
  const { id } = req.params
  const { mother_company } = req.user

  const chalan = await Chalan.findOneAndDelete({ _id: id, mother_company: mother_company })

  if (chalan) {
    return res.status(200).json({ msg: "chalan deleted", data: chalan })
  }
  throw new NotFoundError("chalan with particular id was not found")
}

async function getChalanSerialNumber(req, res) {
  const { mother_company } = req.user

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0)

  const chalans = await Chalan.countDocuments({ createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, mother_company })
  
  if (chalans) {
    const serialNumber = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${(chalans + 1).toString().padStart(3, '0')}`
    res.status(200).json(serialNumber)
  } else {
    throw new NotFoundError('No chalans found')
  }
}

module.exports = { createChalan, getAllChalans, getChalan, deleteChalan, updateChalan, getChalanSerialNumber }
