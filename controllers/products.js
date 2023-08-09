import products from '../models/products.js'
import { StatusCodes } from 'http-status-codes'
import { grtMessageFromValidationError } from '../utils/error.js'
// import users from '../models/users.js'

export const create = async (req, res) => {
  try {
    const result = await products.create({
      name: req.body.name,
      price: req.body.price,
      images: req.files.map(file => file.path),
      description: req.body.description,
      category: req.body.category,
      manufacturers: req.body.manufacturers,
      sell: req.body.sell,
      color: req.body.color,
      textColor: req.body.textColor
    })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
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

export const getAll = async (req, res) => {
  try {
    // .skip()跳過面幾筆資料
    // .limit()回傳幾筆
    let result = products
      .find({
        $or: [
          // 轉換成正則表達式?加g會怎樣?
          { name: new RegExp(req.query.search, 'i') },
          { category: new RegExp(req.query.search, 'i') },
          { manufacturers: new RegExp(req.query.search, 'i') }
        ]
      })
      .sort({ [req.query.sortBy]: req.query.sortOrder === 'asc' ? 1 : -1 })
    if (req.query.itemsPerPage > -1) {
      result = result
        .skip((req.query.page - 1) * req.query.itemsPerPage)
        .limit(req.query.itemsPerPage)
    }
    result = await result
    // 有幾筆資料
    const count = await products.estimatedDocumentCount()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      // 多包一層，疑問
      result: {
        data: result,
        count
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const get = async (req, res) => {
  try {
    const result = await products.find({ sell: true })
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

export const getId = async (req, res) => {
  try {
    // const abd = await users.find()
    // console.log(req.params.id)
    // for (let i = 0; i < abd.length; i++) {
    //   abd[i].like.some(item => item.product.toString() === req.params.id.toString())
    // }

    const result = await products.findById(req.params.id).populate('peopleSay.user', 'name account')
    if (!result) {
      throw new Error('NOT FOUND')
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'CastError') {
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

export const edit = async (req, res) => {
  try {
    let allImages = req.files.map(file => file.path)
    if (allImages.length <= 0) { allImages = undefined }
    const result = await products.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: req.body.price,
      images: allImages,
      description: req.body.description,
      category: req.body.category,
      manufacturers: req.body.manufacturers,
      sell: req.body.sell,
      color: req.body.color,
      textColor: req.body.textColor
    }, { new: true, runValidators: true })
    if (!result) { throw new Error('NOT FOUND') }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
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

export const AddSay = async (req, res) => {
  try {
    const product = await products.findById(req.params.id)
    const agnin = product.peopleSay.some(people => people.user.toString() === req.user._id.toString())

    if (!product) {
      throw new Error('NOT FOUND')
    } else if (agnin) {
      throw new Error('AGAIN')
    } else {
      product.peopleSay.push({
        user: req.user._id,
        text: req.body.text
      })
      await product.save()
    }
    const result = await products.findById(req.params.id, 'peopleSay')
      .populate('peopleSay.user', 'name account')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '新增成功',
      result: result.peopleSay
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: grtMessageFromValidationError(error)
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '找不到'
      })
    } else if (error.message === 'AGAIN') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '重複'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}
export const editSay = async (req, res) => {
  try {
    const product = await products.findById(req.params.id)
    const idx = product.peopleSay.findIndex(people => people.user.toString() === req.user._id.toString())
    const change = product.peopleSay[idx]
    if (!product) {
      throw new Error('NOT FOUND')
    } else {
      change.text = req.body.text + '(已編輯)'
      change.date = Date.now()
      await product.save()
    }
    const result = await products.findById(req.params.id, 'peopleSay')
      .populate('peopleSay.user', 'name account')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '修改成功',
      result: result.peopleSay
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: grtMessageFromValidationError(error)
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.BAD_REQUEST).json({
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

export const reviewSay = async (req, res) => {
  try {
    const product = await products.findById(req.params.id)
    const idx = product.peopleSay.findIndex(people => people.user.toString() === req.body.id)
    const change = product.peopleSay[idx]
    if (!product) {
      throw new Error('NOT FOUND')
    } else {
      change.review = !change.review
      await product.save()
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '審核成功'
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: grtMessageFromValidationError(error)
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.BAD_REQUEST).json({
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

export const red = async (req, res) => {
  try {
    let result = false
    const abb = await req.user.like.findIndex(color => color.product.toString() === req.body.app.toString())
    if (abb > -1) {
      result = true
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '成功',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}
