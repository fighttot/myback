import mongoose from 'mongoose'

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

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  date: {
    type: Date,
    default: Date.now
  },
  cart: {
    type: [cartSchema],
    default: [],
    validate: {
      validator(value) {
        return Array.isArray(value) && value.length > 0
      },
      message: '購物車不能為空'
    }
  },
  ok: {
    type: String,
    default: '訂單確認中'
  },
  changedate: {
    type: Date,
    default: Date.now
  },
  seventhome: {
    type: String,
    required: [true, '缺少地址']
  },
  paywat: {
    type: String,
    required: [true, '缺少付款方式']
  }
}, { versionKey: false })

export default mongoose.model('orders', schema)
