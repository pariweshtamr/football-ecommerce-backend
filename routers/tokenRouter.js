import express from 'express'
const Router = express.Router()

import { verifyRefreshJWT, createAccessJWT } from '../helpers/jwt.helper.js'
import { getUserByUsernameAndRefreshToken } from '../models/User/User.model.js'

Router.all('/', (req, res, next) => {
  console.log('token got hit')
  next()
})

Router.get('/', async (req, res) => {
  try {
    const { authorization } = req.headers
    //check if token is valid
    const { username } = verifyRefreshJWT(authorization)

    // get user info
    if (username) {
      // get user Id from DB by username
      const filter = {
        username,
        refreshJWT: authorization,
      }
      const user = await getUserByUsernameAndRefreshToken(filter)

      if (user?._id) {
        const accessJWT = await createAccessJWT({ _id: user._id, username })
        console.log(accessJWT, 'new access JWT')

        return res.json({
          accessJWT,
        })
      }
    }

    res.status(401).json({
      status: 'Error',
      message: 'Unauthenticated',
    })
  } catch (error) {
    console.log(error)
    res.status(401).json({
      status: 'Error',
      message: 'Unauthenticated',
    })
  }
})

export default Router
