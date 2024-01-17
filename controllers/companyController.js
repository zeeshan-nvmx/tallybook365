const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')
const Company = require('../models/companyModel')
const Invoice = require('../models/invoiceModel')
const Quote = require('../models/quoteModel')

async function createCompany(req, res) {
  const { mother_company, company_remaining_amount, mother_company_logo, mother_company_image, mother_company_default_bank_account, mother_company_default_bank_name_address, mother_company_default_routing_no, mother_company_default_bank_routing_no } = req.body

  const company = await Company.create({ mother_company, company_remaining_amount, mother_company_logo, mother_company_image, mother_company_default_bank_account, mother_company_default_bank_name_address, mother_company_default_routing_no, mother_company_default_bank_routing_no })

  if (company) {
    console.log(company)
    return res.status(201).json({ msg: 'company successfully inserted', data: company })
  } else {
    throw new BadRequestError('failed to create new company, try again')
  }
}

 // Replace with your actual Quote model path

async function getCurrentMonthQuoteTotal(req, res) {
  const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const endOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)

  const aggregationPipeline = [
    {
      $match: {
        createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalQuotedAmount: { $sum: '$grand_total' },
      },
    },
  ]

  try {
    const quoteResults = await Quote.aggregate(aggregationPipeline).exec()
    const totalQuotedAmount = quoteResults.length ? quoteResults[0].totalQuotedAmount : 0

    res.status(200).json({ totalQuotedAmount })
  } catch (error) {
    console.error('Error fetching current month quote total:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}


async function getCurrentMonthInvoiceTotal(req, res) {
  const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const endOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)

  const aggregationPipeline = [
    {
      $match: {
        createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalInvoicedAmount: { $sum: '$grand_total' },
      },
    },
  ]

  try {
    const invoiceResults = await Invoice.aggregate(aggregationPipeline).exec()
    const totalInvoicedAmount = invoiceResults.length ? invoiceResults[0].totalInvoicedAmount : 0

    res.status(200).json({ totalInvoicedAmount })
  } catch (error) {
    console.error('Error fetching current month invoice total:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}


async function getQuoteInvoiceSixMonthTotal(req, res) {
  const getMonthYearString = (date) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  }

  const fetchMonthlyDues = async (startOfMonth, endOfMonth) => {
    const aggregationPipeline = [
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalDue: { $sum: '$grand_total' },
        },
      },
    ]

    const quoteResult = await Quote.aggregate(aggregationPipeline).exec()
    const invoiceResult = await Invoice.aggregate(aggregationPipeline).exec()

    const totalQuoteDues = quoteResult.length ? quoteResult[0].totalDue : 0
    const totalInvoiceDues = invoiceResult.length ? invoiceResult[0].totalDue : 0

    return { totalQuoteDues, totalInvoiceDues }
  }

  const getLastSixMonthsDues = async () => {
    const currentDate = new Date()
    const results = []

    for (let i = 6; i > 0; i--) {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0)
      const monthYearString = getMonthYearString(startOfMonth)

      const { totalQuoteDues, totalInvoiceDues } = await fetchMonthlyDues(startOfMonth, endOfMonth)

      const resultObj = {
        month: monthYearString,
        totalQuotedAmount: totalQuoteDues,
        totalInvoicedAmount: totalInvoiceDues,
      }

      results.push(resultObj)
    }

    return results
  }

  try {
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const currentMonthDues = await fetchMonthlyDues(startOfMonth, endOfMonth)
    const runningMonthQuoteTotal = { currentMonth: getMonthYearString(startOfMonth), totalQuotedAmount: currentMonthDues.totalQuoteDues }
    const runningMonthInvoiceTotal = { currentMonth: getMonthYearString(startOfMonth), totalInvoicedAmount: currentMonthDues.totalInvoiceDues }

    const lastSixMonthsDues = await getLastSixMonthsDues()
    // lastSixMonthsDues.forEach((result) => console.log(result));

    res.status(200).json({ runningMonthQuoteTotal, runningMonthInvoiceTotal, lastSixMonthsDues })
  } catch (error) {
    console.error('Error fetching dues:', error)
  }
}

module.exports = { createCompany, getQuoteInvoiceSixMonthTotal, getCurrentMonthQuoteTotal, getCurrentMonthInvoiceTotal }
