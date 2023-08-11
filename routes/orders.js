import express from 'express'
import * as auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'
import { create, get, getAll, Alleditorder } from '../controllers/orders.js'

const router = express.Router()

router.post('/', auth.jwt, create)
router.get('/', auth.jwt, get)
router.get('/all', auth.jwt, admin, getAll)
router.post('/editorder', auth.jwt, admin, Alleditorder)
router.post('/edituseorder', auth.jwt, Alleditorder)

export default router
