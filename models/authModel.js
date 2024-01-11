// const mongoose = require('mongoose')
// const { isEmail } = require('validator')

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'please provide a name'],
//   },
//   phone: {
//     type: String,
//     required: [true, 'please provide a phone number'],
//     minlength: 11,
//   },
//   email: {
//     type: String,
//     required: [true, 'please provide an email'],
//     unique: [true, 'email needs to be unique'],
//     validate: {
//       validator: isEmail,
//       message: 'please provide a valid email',
//     },
//   },
//   password: {
//     type: String,
//     required: [true, 'please provide a password'],
//     minlength: 6,
//   },
//   mother_company: {
//     type: String,
//   },
//   role: {
//     type: String,
//     enum: ['sass-admin', 'admin', 'user'],
//     default: 'user',
//   },
// })

// module.exports = mongoose.model('User', UserSchema)

const mongoose = require('mongoose')
const { isEmail } = require('validator')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide a name'],
  },
  phone: {
    type: String,
    required: [true, 'please provide a phone number'],
    unique: [true, 'phone number needs to be unique'],
    minlength: 11,
  },
  email: {
    type: String,
    required: [true, 'please provide an email'],
    unique: [true, 'email needs to be unique'],
    validate: {
      validator: isEmail,
      message: 'please provide a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 6,
  },
  mother_company: {
    type: String,
  },
  role: {
    type: String,
    enum: ['sass-admin', 'admin', 'user'],
    default: 'user',
  },
  signature: {
    type: String,
  },
  profile_image: {
    type: String,
  },
  designation: {
    type: String,
  },
})

module.exports = mongoose.model('User', UserSchema)
