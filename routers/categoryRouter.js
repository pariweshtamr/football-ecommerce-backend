import express from 'express'
const Router = express.Router()

import { categories } from '../data.js'

Router.get('/', (req, res) => {
  res.json(categories)
})

export default Router
