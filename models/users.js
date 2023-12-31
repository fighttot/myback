import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRole.js'

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.ObjectId,
    ref: 'products',
    required: [true, '缺少商品']
  },
  quantity: {
    type: Number,
    required: [true, '缺少數量']
  }
}, { versionKey: false })

const likeSchema = new mongoose.Schema({
  product: {
    type: mongoose.ObjectId,
    ref: 'products',
    required: [true, '缺少商品']
  }
}, { versionKey: false })

const schema = new mongoose.Schema({
  account: {
    type: String,
    required: [true, '缺少帳號'],
    minlength: [4, '帳號長度不足'],
    maxlength: [20, '超過字數上限'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  password: {
    type: String,
    required: [true, '缺少密碼']
  },
  name: {
    type: String,
    unique: true,
    required: [true, '缺少暱稱']
  },
  email: {
    type: String,
    unique: true,
    required: [true, '缺少信箱'],
    validate: {
      validator(value) {
        return validator.isEmail(value)
      },
      message: '信箱格式錯誤'
    }
  },
  tokens: {
    type: [String],
    default: []
  },
  cart: {
    type: [cartSchema],
    default: []
  },
  like: {
    type: [likeSchema],
    default: []
  },
  role: {
    type: Number,
    default: UserRole.USER
  },
  image: {
    type: String
  }
}, { versionKey: false })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length < 4) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼太短' }
      ))
      next(error)
      return
    } else if (user.password.length > 20) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼太長' }
      ))
      next(error)
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length < 4) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼太短' }
      ))
      next(error)
      return
    } else if (user.password.length > 20) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼太長' }
      ))
      next(error)
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})
export default mongoose.model('users', schema)
