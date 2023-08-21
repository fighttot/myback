import express from 'express'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import admin from '../middlewares/admin.js'
import contentType from '../middlewares/contentType.js'
import { create, getAll, get, getId, edit, AddSay, editSay, reviewSay, red, lineAll, getone } from '../controllers/products.js'

const router = express.Router()

router.post('/', auth.jwt, admin, contentType('multipart/form-data'), upload, create)
router.get('/all', auth.jwt, admin, getAll)
router.get('/', get)
router.get('/getone', getone)
router.get('/:id', getId)
router.patch('/:id', auth.jwt, admin, contentType('multipart/form-data'), upload, edit)
router.post('/:id/say', auth.jwt, contentType('application/json'), AddSay)
router.patch('/:id/say', auth.jwt, contentType('application/json'), editSay)
router.patch('/:id/review', auth.jwt, reviewSay)
router.post('/red', auth.jwt, red)

router.post('/lineAll', auth.jwt, admin, lineAll)

export default router
