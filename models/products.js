import mongoose from 'mongoose'

const saySchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  text: {
    type: String,
    required: [true, '缺少評論']
  },
  review: {
    type: Boolean,
    required: [true, '缺少審核'],
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少名稱']
  },
  price: {
    type: Number,
    required: [true, '缺少價格'],
    min: [0, '價格太低']
  },
  images: {
    type: [String],
    // 缺少圖片沒有用
    required: [true, '缺少圖片']
  },
  // 說明
  description: {
    type: String,
    required: [true, '缺少說明']
  },
  // 分類 ex:碧蘭航線、碧蘭幻想
  category: {
    type: String,
    required: [true, '缺少分類']
  },
  // 廠商:alter、壽屋
  manufacturers: {
    type: String,
    required: [true, '缺少製造商'],
    enum: {
      values: ['MIMEYOI', 'ALTER', '好微笑', '壽屋'],
      message: '無此製造商'
    }
  },
  // 評價
  peopleSay: {
    type: [saySchema],
    default: []
  },
  sell: {
    type: Boolean,
    required: [true, '缺少上架狀態']
  },
  color: {
    type: String,
    required: [true, '缺少主題色']
  },
  textColor: {
    type: String,
    required: [true, '缺少文字主題色']
  },
  totle: {
    type: Number,
    default: 0
  },
  sellTotle: {
    type: Number,
    default: 0
  }
}, { versionKey: false })

export default mongoose.model('products', schema)
