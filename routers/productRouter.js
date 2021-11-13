import express from 'express'
const Router = express.Router()

import { products } from '../data.js'

Router.get('/', (req, res) => {
  res.json(products)
})

Router.get('/:id', (req, res) => {
  const product = products.find((x) => x._id === Number(req.params.id))
  console.log(products)
  if (product) {
    res.send(product)
  } else {
    res.status(404).send({ message: 'Product not found' })
  }
})

export default Router
