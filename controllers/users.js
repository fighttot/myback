import users from '../models/users.js'
import { StatusCodes } from 'http-status-codes'
import { grtMessageFromValidationError } from '../utils/error.js'
import jwt from 'jsonwebtoken'
import products from '../models/products.js'
import bcrypt from 'bcrypt'

export const create = async (req, res) => {
  try {
    // 可能需要註冊就登入，所以先保留result
    // const result = await users.create(req.body)
    await users.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: grtMessageFromValidationError(error)
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '帳號已註冊，檢查信箱或是暱稱跟帳號'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign(
      { _id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7 days' }
    )
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        cart: req.user.cart.reduce((totle, current) => totle + current.quantity, 0),
        like: req.user.like.length
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const edit = async (req, res) => {
  try {
    // 會被清空
    const item = await users.findByIdAndUpdate(req.user.id, req.body
      // account: req.body?.account,
      // password: req.body?.password,
      // name: req.body?.name,
      // email: req.body?.email
      , { new: true })

    if (!item) { throw new Error('NOT FOUND') }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '修改成功',
      result: {
        account: item.account,
        name: item.name,
        email: item.email,
        password: item.password
      }
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: grtMessageFromValidationError(error)
      })
    } else if (error.name === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤(id錯誤)'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}

export const forget = async (req, res) => {
  try {
    const user = await users.find()
    const idx = await user.findIndex(item => item.account === req.body.account)
    if (idx === -1) {
      throw new Error('NOT FOUND')
    } else if (bcrypt.compareSync(req.body.password, user[idx].password)) {
      throw new Error('PASS')
    } else if (user[idx].email === req.body.email) {
      user[idx].password = req.body.password
    } else { throw new Error('EMAIL') }

    await user[idx].save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '密碼更改完成'
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: grtMessageFromValidationError(error)
      })
    } else if (error.message === 'EMAIL') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '信箱輸入錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '沒有這個帳號'
      })
    } else if (error.message === 'PASS') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '密碼與之前重複'
      })
    } else {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign(
      { _id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7 days' }
    )
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const getProfile = (req, res) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name,
        cart: req.user.cart.reduce((totle, current) => totle + current.quantity, 0),
        like: req.user.like.length
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}
export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.product')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: result.cart
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const editCart = async (req, res) => {
  try {
    const idx = req.user.cart.findIndex(cart => cart.product.toString() === req.body.product)
    if (idx > -1) {
      const quantity = req.user.cart[idx].quantity + parseInt(req.body.quantity)
      if (quantity <= 0) {
        req.user.cart.splice(idx, 1)
      } else {
        req.user.cart[idx].quantity = quantity
      }
    } else {
      const product = await products.findById(req.body.product)
      if (!product || !product.sell) {
        throw new Error('NOT FOUND')
      } else {
        req.user.cart.push({
          product: product._id,
          quantity: req.body.quantity
        })
      }
    }
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: req.user.cart.reduce((total, current) => total + current.quantity, 0)
    })
  } catch (error) {
    if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到'
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

export const getLike = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'like').populate('like.product')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: result.like
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const editLike = async (req, res) => {
  try {
    const idx = req.user.like.findIndex(like => like.product.toString() === req.body.product)
    const product = await products.findById(req.body.product)
    if (idx > -1) {
      req.user.like.splice(idx, 1)
      product.totle--
    } else {
      if (!product || !product.sell) {
        throw new Error('NOT FOUND')
      } else {
        req.user.like.push({
          product: product._id
        })
      }
      product.totle++
    }
    await product.save()
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        length: req.user.like.length,
        totle: product.totle
      }

    })
  } catch (error) {
    if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到'
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

export const overLike = async (req, res) => {
  try {
    for (let i = 0; i < req.user.like.length; i++) {
      const app = req.user.cart.some(item => item.product.toString() === req.user.like[i].product.toString())
      const product = await products.findById(req.user.like[i].product)

      product.totle--
      await product.save()
      if (!product || !product.sell) {
        throw new Error('NOT FOUND')
      } else if (!app) {
        req.user.cart.push({
          product: req.user.like[i].product,
          quantity: 1
        })
      }
    }

    req.user.like = []
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: req.user.cart.reduce((total, current) => total + current.quantity, 0)
    })
  } catch (error) {
    if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到'
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

export const overLikesing = async (req, res) => {
  try {
    const idx = req.user.like.findIndex(item => item.product.toString() === req.body.product.toString())
    const product = await products.findById(req.body.product)
    if (!product || !product.sell) {
      throw new Error('NOT FOUND')
    } else if (req.user.cart.length < 1) {
      req.user.cart.push({
        product: req.user.like[idx].product,
        quantity: 1
      })
    } else {
      const app = req.user.cart.some(item => item.product.toString() === req.user.like[idx].product.toString())
      if (!app) {
        req.user.cart.push({
          product: req.user.like[idx].product,
          quantity: 1
        })
      }
    }
    product.totle--
    req.user.like.splice(idx, 1)
    await req.user.save()
    await product.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result:
      {
        like: req.user.like.length,
        cart: req.user.cart.reduce((total, current) => total + current.quantity, 0)
      }
    })
  } catch (error) {
    if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到'
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
