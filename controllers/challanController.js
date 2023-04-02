const BadRequestError = require("../errors/bad-request")
const NotFoundError = require("../errors/not-found")
const Challan = require("../models/challanModel")

async function createChallan(req, res) {
  const {
    user_id,
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

  const challan = await Challan.create({
    user_id,
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

  if (challan) {
    console.log(challan)
    return res.status(201).json({ msg: "challan inserted", data: challan })
  } else {
    throw new BadRequestError("failed to create new challan, try again")
  }
}

async function getAllChallans(req, res) {
  const { user_id, role } = req.user

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 30
  const skip = (page - 1) * limit

  if (role === "admin") {
    const challans = await Challan.find({}).sort("-date").skip(skip).limit(limit)
    console.log(challans)
    if (challans) {
      return res.status(200).json(challans)
    }
    throw new NotFoundError(`challans not found ( role is ${role})`)
  }

  if (role === "user") {
    const challans = await Challan.find({ user_id: user_id }).sort("-date").skip(skip).limit(limit)
    if (challans) {
      return res.status(200).json(challans)
    }
    throw new NotFoundError(`challans not found ( role is ${role})`)
  }
}

async function getChallan(req, res) {
  const { id } = req.params
  console.log(typeof id)
  const challan = await Challan.findOne({ _id: id })
  console.log(challan)
  if (challan) {
    return res.status(200).json(challan)
  }
  throw new NotFoundError("challan with particular id not found")
}

async function updateChallan(req, res) {
  const { id } = req.params

  const challan = await Challan.findOneAndUpdate({ _id: id }, req.body, { new: true })

  if (challan) {
    return res.status(200).json({ msg: "challan successfully updated", data: challan })
  }
  throw new BadRequestError("couldn't update challan, sorry :(")
}

async function deleteChallan(req, res) {
  const { id } = req.params
  console.log(typeof id)
  const challan = await Challan.findOneAndDelete({ _id: id })

  if (challan) {
    return res.status(200).json({ msg: "challan deleted", data: challan })
  }
  throw new NotFoundError("challan with particular id was not found")
}

module.exports = { createChallan, getAllChallans, getChallan, deleteChallan, updateChallan }
