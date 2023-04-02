const BadRequestError = require("../errors/bad-request")
const NotFoundError = require("../errors/not-found")
const WorkOrder = require("../models/workorderModel")

async function createWorkOrder(req, res) {
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

  const workorder = await WorkOrder.create({
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

  if (workorder) {
    console.log(workorder)
    return res.status(201).json({ msg: "workorder inserted", data: workorder })
  } else {
    throw new BadRequestError("failed to create new workorder, try again")
  }
}

async function getAllWorkOrders(req, res) {
  const { user_id, role } = req.user

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 30
  const skip = (page - 1) * limit

  if (role === "admin") {
    const workorders = await WorkOrder.find({}).sort("-date").skip(skip).limit(limit)
    if (workorders) {
      return res.status(200).json(workorders)
    }
    throw new NotFoundError(`workorders not found ( role is ${role})`)
  }

  if (role === "user") {
    const workorders = await WorkOrder.find({ user_id: user_id }).sort("-date").skip(skip).limit(limit)
    if (workorders) {
      return res.status(200).json(workorders)
    }
    throw new NotFoundError(`workorders not found ( role is ${role})`)
  }
}

async function getWorkOrder(req, res) {
  const { id } = req.params
  console.log(typeof id)
  const workorder = await WorkOrder.findOne({ _id: id })
  console.log(workorder)
  if (workorder) {
    return res.status(200).json(workorder)
  }
  throw new NotFoundError("workorder with particular id not found")
}

async function updateWorkOrder(req, res) {
  const { id } = req.params

  const workorder = await WorkOrder.findOneAndUpdate({ _id: id }, req.body, { new: true })

  if (workorder) {
    return res.status(200).json({ msg: "workorder successfully updated", data: workorder })
  }
  throw new BadRequestError("couldn't update workorder, sorry :(")
}

async function deleteWorkOrder(req, res) {
  const { id } = req.params
  console.log(typeof id)
  const workorder = await WorkOrder.findOneAndDelete({ _id: id })

  if (workorder) {
    return res.status(200).json({ msg: "workorder deleted", data: workorder })
  }
  throw new NotFoundError("workorder with particular id was not found")
}

module.exports = { createWorkOrder, getAllWorkOrders, getWorkOrder, deleteWorkOrder, updateWorkOrder }
