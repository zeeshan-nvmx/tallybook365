const BadRequestError = require("../errors/bad-request")
const NotFoundError = require("../errors/not-found")
const Invoice = require("../models/invoiceModel")
const Quote = require('../models/quoteModel')

async function createInvoice(req, res) {
  const { user_id, quote_id, mother_company, client_id, client_name, client_address, title, job_no, date, items, vat, asf, advance, due, grand_total, t_and_c, bank_account, bank_name_address, swift, routing_no, brand, job_type } =
    req.body

  const invoice = await Invoice.create({
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
    advance,
    due,
    t_and_c,
    bank_account,
    bank_name_address,
    swift,
    routing_no,
    brand,
    job_type,
    grand_total
  })

  console.log(invoice)

  if (invoice) {
    
    const quote = await Quote.findOneAndUpdate({ _id: quote_id }, { invoice_id: invoice._id }, { new: true })
    if (quote) {
      return res.status(201).json({ msg: 'invoice successfully created', data: invoice })
    } else {
      await invoice.findOneAndDelete({ _id: invoice._id })
      throw new NotFoundError(`quote with ${quote_id} not found, so invoice is being deleted`)
    }
  } else {
    throw new BadRequestError('failed to create new invoice, try again')
  }
}

async function getAllInvoices(req, res) {
  const { user_id, role, mother_company } = req.user

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 30
  const skip = (page - 1) * limit

  if (role === "admin") {
    const invoices = await Invoice.find({ mother_company: mother_company }).sort('-date').skip(skip).limit(limit)
    
    if (invoices) {
      return res.status(200).json(invoices)
    }
    throw new NotFoundError(`invoices not found ( role is ${role})`)
  }

  if (role === "user") {
    const invoices = await Invoice.find({ user_id: user_id, mother_company: mother_company }).sort('-date').skip(skip).limit(limit)
    console.log(invoices, role)
    if (invoices) {
      return res.status(200).json(invoices)
    }
    throw new NotFoundError(`invoices not found ( role is ${role})`)
  }
}

async function getInvoiceByMonth(req, res) {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Both month and year are required query parameters." });
    }

    // JavaScript counts months from 0 (January) to 11 (December),
    // so we subtract 1 from the provided month to account for this.
    let startDate = new Date(year, month - 1, 1);
    let endDate = new Date(year, month, 0); // This date doesn't exist, so it will roll over to the first day of the next month

    let invoices = await Invoice.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}


async function getInvoice(req, res) {
  const { id } = req.params
  const { mother_company } = req.user
  const invoice = await Invoice.findOne({ _id: id, mother_company: mother_company })
  console.log(invoice)
  if (invoice) {
    return res.status(200).json(invoice)
  }
  throw new NotFoundError("invoice with particular id not found")
}

async function updateInvoice(req, res) {
  const { id } = req.params
  const { mother_company } = req.user

  const invoice = await Invoice.findOneAndUpdate({ _id: id, mother_company: mother_company }, req.body, { new: true })

  if (invoice) {
    return res.status(200).json({ msg: "invoice successfully updated", data: invoice })
  }
  throw new BadRequestError("couldn't update invoice, sorry :(")
}

async function deleteInvoice(req, res) {
  const { id } = req.params
  const { mother_company } = req.user
  
  const invoice = await Invoice.findOneAndDelete({ _id: id, mother_company: mother_company })

  if (invoice) {
    return res.status(200).json({ msg: "invoice deleted", data: invoice })
  }
  throw new NotFoundError("invoice with particular id was not found")
}

async function getInvoiceSerialNumber(req, res) {
  const { mother_company } = req.user

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0)

  const invoices = await Invoice.countDocuments({ createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, mother_company })
  console.log(invoices)

  const serialNumber = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${(invoices + 1).toString().padStart(3, '0')}`
  res.status(200).json(serialNumber)
}

module.exports = { createInvoice, getAllInvoices, getInvoiceByMonth, getInvoice, deleteInvoice, updateInvoice, getInvoiceSerialNumber }