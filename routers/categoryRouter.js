import express from 'express'
const Router = express.Router()
import slugify from 'slugify'

import { addCategory } from '../models/Category/Category.model.js'
import {
  getAllCategories,
  getACategory,
} from '../models/Category/Category.model.js'
import { newCategoryValidation } from '../middlewares/formValidation.middleware.js'

//Create new category
Router.post('/', newCategoryValidation, async (req, res) => {
  try {
    console.log(req.body)

    const slug = slugify(req.body.name, { lower: true })
    console.log(slug)

    const result = await addCategory({ ...req.body, slug })

    const status = result?._id ? 'success' : 'error'
    const message = result?._id
      ? 'Category has been created successfully'
      : 'Unable to create category. Please try again later'

    res.send({ status, message })
  } catch (error) {
    console.log(error)

    let msg = 'Error, unable to add new category. Please try again later'

    if (error.message.includes('E11000 duplicate key error collection')) {
      msg = 'Error, the category already exists'
    }

    res.json({
      status: 'error',
      message: msg,
    })
  }
})

// Get all categories

Router.get('/:_id?', async (req, res) => {
  try {
    const { _id } = req.params
    let result

    if (_id) {
      result = await getACategory(_id)
    } else {
      result = await getAllCategories()
    }

    res.json({
      status: 'success',
      message: 'All the categories',
      categories: result || [],
    })
  } catch (error) {
    console.log(error)
    res.json({ status: 'error', message: error.message })
  }
})

export default Router
