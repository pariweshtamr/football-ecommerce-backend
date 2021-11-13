import SessionSchema from './Session.schema.js'

export const storeSession = (tokenObj) => {
  return SessionSchema(tokenObj).save()
}

export const removeSession = (token) => {
  return SessionSchema.deleteOne({ token: token })
}
