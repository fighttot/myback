import express from 'express'
import contentType from '../middlewares/contentType.js'
import { create, login, logout, extend, getProfile, getCart, editCart, getLike, editLike, overLike, overLikesing, edit, forget } from '../controllers/users.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()

router.post('/', contentType('application/json'), create)
router.post('/login', contentType('application/json'), auth.login, login)
router.patch('/edit', auth.jwt, contentType('application/json'), edit)
router.patch('/forget', contentType('application/json'), auth.forget, forget)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
router.get('/me', auth.jwt, getProfile)
router.get('/cart', auth.jwt, getCart)

router.get('/like', auth.jwt, getLike)
router.post('/cart', contentType('application/json'), auth.jwt, editCart)

router.post('/like', contentType('application/json'), auth.jwt, editLike)

router.post('/likeover', auth.jwt, overLike)
router.post('/likeoversing', contentType('application/json'), auth.jwt, overLikesing)

export default router
