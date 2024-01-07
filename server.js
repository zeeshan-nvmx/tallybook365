const express = require('express')
const app = express()
require('express-async-errors')
const morgan = require("morgan")
const cors = require("cors")
const helmet = require("helmet")
const xss = require("xss-clean")
const mongoSanitize = require("express-mongo-sanitize")

const port = process.env.PORT || 3000

require('dotenv').config()

const authRouter = require('./routes/authRouter')
const companyRouter = require('./routes/companyRouter')
const clientRouter = require("./routes/clientRouter")
const vendorRouter = require('./routes/vendorRouter')
const quoteRouter = require("./routes/quoteRouter")
const invoiceRouter = require("./routes/invoiceRouter")
const chalanRouter = require('./routes/chalanRouter')
const purchaseOrderRouter = require('./routes/purchaseOrderRouter')



const connectDB = require('./utils/db')
const errorHandler = require('./utils/error-handler')
const { authenticateUser } = require('./utils/authorize-authenticate')
const notFoundError = require('./utils/not-found-404')




app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())
app.use(morgan('dev'))
app.use(express.json())


app.get('/api/v1/showme', authenticateUser, (req, res) => {
  res.json(req.user)
})


app.use('/api/v1/auth', authRouter)
app.use('/api/v1', companyRouter)
app.use("/api/v1", clientRouter)
app.use("/api/v1", vendorRouter)
app.use("/api/v1", quoteRouter)
app.use("/api/v1", invoiceRouter)
app.use("/api/v1", chalanRouter)
app.use("/api/v1", purchaseOrderRouter)

app.use(notFoundError)
app.use(errorHandler)

const startServer = () => {
  app.listen(port, () => {
    connectDB(process.env.MONGO_URL)
    console.log("server started on port 8080");
  })
}

startServer()
