const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')
const z = require('zod')
const Quote = require('../models/quoteModel')
const { validateRequestFields, generateDefaultErrorMessage } = require('../utils/validations')

// const createQuoteSchema = z.object({
//   user_id: z.string(),
//   mother_company: z.string(),
//   invoice_id: z.string().optional(),
//   chalan_id: z.string().optional(),
//   purchaseOrder_id: z.string().optional(),
//   client_id: z.string(),
//   client_name: z.string(),
//   client_address: z.string(),
//   title: z.string(),
//   job_no: z.string(),
//   date: z.date().optional(),
//   items: z.array(
//     z.object({
//       particulars: z.string(),
//       details: z.string(),
//       quantity: z.string(),
//       day: z.string(),
//       unitPrice: z.string(),
//       totalPrice: z.number(),
//     })
//   ),
//   vat: z.number().optional(),
//   asf: z.number().optional(),
//   t_and_c: z.string(),
//   bank_account: z.string().optional(),
//   bank_name_address: z.string().optional(),
//   swift: z.string().optional(),
//   routing_no: z.string().optional(),
//   brand: z.string().optional(),
//   job_type: z.string(),
//   grand_total: z.number(),
// })

const createQuoteSchema = z.object({
  user_id: z.string().refine((val) => val.length > 0, { message: 'User ID is required' }),
  mother_company: z.string().refine((val) => val.length > 0, { message: 'Mother company is required' }),
  invoice_id: z.string().optional(),
  chalan_id: z.string().optional(),
  purchaseOrder_id: z.string().optional(),
  client_id: z.string().refine((val) => val.length > 0, { message: 'Client ID is required' }),
  client_name: z.string().refine((val) => val.length > 0, { message: 'Client name is required' }),
  client_address: z.string().refine((val) => val.length > 0, { message: 'Client address is required' }),
  title: z.string().refine((val) => val.length > 0, { message: 'Title is required' }),
  job_no: z.string().refine((val) => val.length > 0, { message: 'Job number is required' }),
  date: z.date().optional(),
  items: z.array(
    z.object({
      particulars: z.string().refine((val) => val.length > 0, { message: 'Particulars are required' }),
      details: z.string().refine((val) => val.length > 0, { message: 'Details are required' }),
      quantity: z.string().refine((val) => val.length > 0, { message: 'Quantity is required' }),
      day: z.string().refine((val) => val.length > 0, { message: 'Day is required' }),
      unitPrice: z.string().refine((val) => val.length > 0, { message: 'Unit price is required' }),
      totalPrice: z.number().refine((val) => val >= 0, { message: 'Total price is required and must be a number' }),
    })
  ),
  vat: z.number().optional(),
  asf: z.number().optional(),
  t_and_c: z.string().refine((val) => val.length > 0, { message: 'Terms and conditions are required' }),
  bank_account: z.string().optional(),
  bank_name_address: z.string().optional(),
  swift: z.string().optional(),
  routing_no: z.string().optional(),
  brand: z.string().optional(),
  job_type: z.string().refine((val) => val.length > 0, { message: 'Job type is required' }),
  grand_total: z.number().refine((val) => val >= 0, { message: 'Grand total is required and must be a number' }),
})

async function createQuote(req, res) {
  // validateRequestFields(req.body, ['user_id', 'mother_company', 'client_id', 'client_name', 'client_address', 'title', 'job_no', 'items', 'job_type', 'grand_total'])

  // const validationResult = createQuoteSchema.safeParse(req.body)
  // if (!validationResult.success) {
  //   throw new BadRequestError(generateDefaultErrorMessage(validationResult.error.issues))
  // }

  const { user_id, mother_company, invoice_id, chalan_id, purchaseOrder_id, client_id, client_name, client_address, title, job_no, date, items, vat, asf, t_and_c, bank_account, bank_name_address, swift, routing_no, brand, job_type, sub_total, grand_total } = req.body

  const quote = await Quote.create({ user_id, mother_company, invoice_id, chalan_id, purchaseOrder_id, client_id, client_name, client_address, title, job_no, date, items, vat, asf, t_and_c, bank_account, bank_name_address, swift, routing_no, brand, job_type, sub_total, grand_total })

  if (quote) {
    console.log(quote)
    return res.status(201).json({ msg: 'quote successfully inserted', data: quote })
  } else {
    throw new BadRequestError('failed to create new quote, try again')
  }
}

async function getAllQuotes(req, res) {
  const { user_id, role, mother_company } = req.user

  console.log(req.user)
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 30
  const skip = (page - 1) * limit

  if (role === 'admin') {
    const quotes = await Quote.find({ mother_company: mother_company }).sort('-date').skip(skip).limit(limit)
    if (quotes) {
      return res.status(200).json(quotes)
    }
    throw new NotFoundError(`quotes not found ( role is ${role})`)
  }

  if (role === 'user') {
    const quotes = await Quote.find({ user_id: user_id, mother_company: mother_company }).sort('-date').skip(skip).limit(limit)
    if (quotes) {
      return res.status(200).json(quotes)
    }
    throw new NotFoundError(`quotes not found ( role is ${role})`)
  }
}

async function getQuotesByMonth(req, res) {
  try {
    const { month, year } = req.query

    if (!month || !year) {
      return res.status(400).json({ message: 'Both month and year are required query parameters.' })
    }

    // JavaScript counts months from 0 (January) to 11 (December),
    // so we subtract 1 from the provided month to account for this.
    let startDate = new Date(year, month - 1, 1)
    let endDate = new Date(year, month, 0) // This date doesn't exist, so it will roll over to the first day of the next month

    let quotes = await Quote.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })

    res.json(quotes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

async function getQuote(req, res) {
  const { id } = req.params
  console.log(typeof id)
  const quote = await Quote.findOne({ _id: id })
  console.log(quote)
  if (quote) {
    return res.status(200).json(quote)
  }
  throw new NotFoundError('quote with particular id not found')
}

async function updateQuote(req, res) {
  const { id } = req.params

  const quote = await Quote.findOneAndUpdate({ _id: id }, req.body, { new: true })

  if (quote) {
    return res.status(200).json({ msg: 'quote successfully updated', data: quote })
  }
  throw new BadRequestError("couldn't update quote, sorry :(")
}

async function deleteQuote(req, res) {
  const { id } = req.params
  console.log(typeof id)
  const quote = await Quote.findOneAndDelete({ _id: id })

  if (quote) {
    return res.status(200).json({ msg: 'quote deleted', data: quote })
  }
  throw new NotFoundError('quote with particular id was not found')
}

async function getQuoteSerialNumber(req, res) {
  const { mother_company } = req.user

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0)

  const quotes = await Quote.countDocuments({ createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, mother_company })
  console.log(quotes)

  const serialNumber = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${(quotes + 1).toString().padStart(3, '0')}`
  res.status(200).json(serialNumber)
}

module.exports = { createQuote, getAllQuotes, getQuotesByMonth, getQuote, deleteQuote, updateQuote, getQuoteSerialNumber }
