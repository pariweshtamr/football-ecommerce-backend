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
      { isEmailConfirmed: true, status: 'active' },
      { new: true },
    )
  } catch (error) {
    throw new Error(error)
  }
}

export const setRefreshJWT = (_id, token) => {
  return UserSchema.findByIdAndUpdate(_id, {
    refreshJWT: token,
  })
}

export const getUserByUsername = (username) => {
  return UserSchema.findOne({ username })
}

export const getUserByUsernameAndRefreshToken = (filter) => {
  return UserSchema.findOne(filter)
}

export const removeRefreshJWT = (refreshJWT) => {
  return UserSchema.findOneAndUpdate({ refreshJWT }, { refreshJWT: '' })
}
