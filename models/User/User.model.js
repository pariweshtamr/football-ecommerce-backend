import UserSchema from './User.schema.js'

//REGISTER

export const createUser = (newUser) => {
  try {
    const user = UserSchema(newUser).save()
    return user
  } catch (error) {
    console.log(error)
  }
}

export const verifyEmail = (email) => {
  try {
    return UserSchema.findOneAndUpdate(
      { email },
      { isEmailConfirmed: true },
      { new: true },
    )
  } catch (error) {
    throw new Error(error)
  }
}
