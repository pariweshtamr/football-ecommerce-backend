import express from 'express'
const Router = express.Router()

Router.all('/', (req, res, next) => {
  res.json({
    status: 'success',
    message: 'from category router',
  })
})

export default Router
