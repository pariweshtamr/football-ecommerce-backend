import express from 'express'
const Router = express.Router()
import { hashPassword, comparePassword } from '../helpers/bcrypt.helper.js'
import {
  createUser,
  verifyEmail,
  getUserByUsername,
} from '../models/User/User.model.js'
import {
  createUniqueEmailConfirmation,
  deleteInfo,
  findUserEmailVerification,
} from '../models/Pin/Pin.model.js'
import {
  sendEmailVerificationConfirmation,
  sendEmailVerificationLink,
} from '../helpers/email.helper.js'
import {
  userEmailVerificationValidation,
  loginUserFormValidation,
} from '../middlewares/formValidation.middleware.js'
import { getJWTs } from '../helpers/jwt.helper.js'

Router.all('/', (req, res, next) => {
  next()
})

Router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'User Profile',
    user: req.user,
  })
})

//CREATE NEW USER
Router.post('/', async (req, res) => {
  console.log(req.body)
  try {
    //encrypt password
    const hashPass = hashPassword(req.body.password)

    if (hashPass) {
      req.body.password = hashPass

      const { _id, firstName, email } = await createUser(req.body)

      if (_id) {
        // create unique activation link
        const { pin } = await createUniqueEmailConfirmation(email)

        if (pin) {
          //email the link to the user email
          const forSendingEmail = {
            firstName,
            email,
            pin,
          }
          sendEmailVerificationLink(forSendingEmail)
        }

        return res.json({
          status: 'success',
          message:
            'New user has been successfully created. We have sent an email confirmation to your email, please check and follow the instructions to verify and activate your account',
        })
      }
    }

    res.json({
      status: 'error',
      message: 'Unable to create new user. Please try again later',
    })
  } catch (error) {
    let msg = 'Error, Unable to create new user'
    console.log(error.message)
    if (error.message.includes('E11000 duplicate key error collection')) {
      msg = 'Error, an account already exists for this email address'
    }
    res.json({
      status: 'error',
      message: 'Unable to create new user',
    })
  }
})

//email verification
Router.patch(
  '/email-verification',
  userEmailVerificationValidation,
  async (req, res) => {
    try {
      const result = await findUserEmailVerification(req.body)

      if (result?._id) {
        //information is valid now we can update the user
        const data = await verifyEmail(result.email)
        if (data?._id) {
          // delete the pin info
          deleteInfo(req.body)

          // send email confirmation to user
          sendEmailVerificationConfirmation({
            firstName: data.firstName,
            email: data.email,
          })

          return res.json({
            status: 'success',
            message: 'Your email has been verified. You may now log in.',
          })
        }
      }
      res.json({
        status: 'error',
        message:
          'Unable to verify your email. The link is either invalid or expired.',
      })
    } catch (error) {
      console.log(error)
      res.json({
        status: 'error',
        message: 'Error, Unable to verify the email. Please try again later.',
      })
    }
  },
)

//USER LOGIN
Router.post('/login', loginUserFormValidation, async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await getUserByUsername(username)

    if (user?._id) {
      // Check if password is valid or not

      const isPasswordMatch = comparePassword(password, user.password)

      if (isPasswordMatch) {
        // GET JWTs tHEN SEND TO CLIENT
        const jwts = await getJWTs({ _id: user._id, username: user.username })
        user.password = undefined

        return res.json({
          status: 'success',
          messsage: 'Login successful',
          jwts,
          user,
        })
      }
    }
    res.status(401).json({
      status: 'error',
      messsage: 'Unauthorized',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Error, unable to login at the moment. Please try again later',
    })
  }
})

export default Router
