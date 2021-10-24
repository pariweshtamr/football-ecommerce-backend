import express from 'express'
const Router = express.Router()
import { hashPassword } from '../helpers/bcrypt.helper.js'
import { createUser, verifyEmail } from '../models/User/User.model.js'
import {
  createUniqueEmailConfirmation,
  deleteInfo,
  findUserEmailVerification,
} from '../models/Pin/Pin.model.js'
import {
  sendEmailVerificationConfirmation,
  sendEmailVerificationLink,
} from '../helpers/email.helper.js'
import { userEmailVerificationValidation } from '../middlewares/formValidation.middleware.js'

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
      message: msg,
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
      res.json({
        status: 'error',
        message: 'Error, Unable to verify the email. Please try again later.',
      })
    }
  },
)

export default Router
