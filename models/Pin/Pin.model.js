import PinSchema from './Pin.schema.js'
import RandomNumberGenerator from '../../utils/RandomNumberGenerator.js'

//creating a unique email validation info
const pinLength = 6
export const createUniqueEmailConfirmation = async (email) => {
  try {
    // generate random 6 digit numbers
    const pin = RandomNumberGenerator(pinLength)

    if (!pin || !email) {
      return false
    }

    const newEmailValidation = {
      pin,
      email,
    }

    // store pin with email in pin table

    const result = await PinSchema(newEmailValidation).save()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const findUserEmailVerification = async (filterObj) => {
  try {
    const result = await PinSchema.findOne(filterObj) //{pin, email}
    return result

    // store pin with email in Pin table
  } catch (error) {
    throw new Error(error)
  }
}

export const deleteInfo = async (filterObj) => {
  try {
    const result = await PinSchema.findOneAndDelete(filterObj)
    return result
  } catch (error) {
    throw new Error(error)
  }
}
