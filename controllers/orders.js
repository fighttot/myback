import orders from '../models/orders.js'
import users from '../models/users.js'
import products from '../models/products.js'
import { StatusCodes } from 'http-status-codes'
import { grtMessageFromValidationError } from '../utils/error.js'

export const create = async (req, res) => {
  try {
    if (req.user.cart.length === 0) {
      throw new Error('EMPTY')
    }
    const user = await users.findById(req.user._id, 'cart').populate('cart.product')
    // every 意思
    const canCheckout = user.cart.every(cart => cart.product.sell)
    if (!canCheckout) {
      throw new Error('SELL')
    }
    const product = await products.find()
    for (let i = 0; i < product.length; i++) {
      const abd = req.user.cart.some(item => item.product.toString() === product[i]._id.toString())

      if (abd) {
        const idx = req.user.cart.findIndex(item => item.product.toString() === product[i]._id.toString())
        const app = req.user.cart[idx].quantity
        product[i].sellTotle += app

        // await product[i].save()
      }
    }
    const savePromises = product.map(item => item.save())
    await Promise.all(savePromises)
    // 建立訂單
    await orders.create({
      user: req.user._id,
      cart: req.user.cart,
      seventhome: req.body.seventhome,
      paywat: req.body.paywat
    })
    req.user.cart = []
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    console.log(error)
    if (error.message === 'EMPTY') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '購物車為空'
      })
    } else if (error.message === 'SELL') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '包含下架商品'
      })
    } else if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: grtMessageFromValidationError(error)
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}
export const get = async (req, res) => {
  try {
    const result = await orders.find({ user: req.user._id }).populate('cart.product')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}
export const getAll = async (req, res) => {
  try {
    const result = await orders.find().populate('cart.product').populate('user', 'account')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const Alleditorder = async (req, res) => {
  try {
    const checkorder = await orders.findById(req.body.id)
    if (req.body.check === 2) {
      checkorder.ok = '訂單已成立'
    } else if (req.body.check === 3) {
      checkorder.ok = '訂單已完成'
    } else if (req.body.check === 4) {
      checkorder.ok = '訂單已取消'
    } else if (req.body.check === 5) {
      checkorder.ok = '取消確認中'
    } else {
      checkorder.ok = '訂單數據錯誤'
    }
    checkorder.changedate = Date.now()
    checkorder.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        ok: checkorder.ok,
        changedate: checkorder.changedate
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}
