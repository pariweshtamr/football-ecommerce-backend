import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      default: 'Inactive',
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isEmailConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    refreshJWT: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('User', UserSchema)
