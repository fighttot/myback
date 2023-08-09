import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import mongoSanitize from 'express-mongo-sanitize'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import routerUsers from './routes/users.js'
import routerProducts from './routes/products.js'
import routerOrders from './routes/orders.js'
import './passport/passport.js'

const app = express()

// app.use(rateLimit({
//   // 15分鐘內最多100次請求
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   // 回應
//   standardHeaders: true,
//   legacyHeaders: false,
//   // 超出流量時的回應
//   statusCode: StatusCodes.TOO_MANY_REQUESTS,
//   message: '超過流量，太多請求',
//   handler(req, res, next, options) {
//     res.status(options.statusCode).json({
//       success: false,
//       message: options.message
//     })
//   }
// }))

app.use(cors({
  origin(origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('CORS'), false)
    }
  }
}))
app.use((_, req, res, next) => {
  res.status(StatusCodes.FORBIDDEN).json({
    success: false,
    message: '請求被拒絕'
  })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})

app.use(mongoSanitize())

app.use('/users', routerUsers)
app.use('/products', routerProducts)
app.use('/orders', routerOrders)

app.all('*', (req, res) => {
  console.log(req)
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: '找不到'
  })
})

app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  await mongoose.connect(process.env.DB_URL)
  mongoose.set('sanitizeFilter', true)
  console.log('資料庫連線成功')
})
