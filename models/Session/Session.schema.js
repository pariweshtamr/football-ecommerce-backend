import mongoose from 'mongoose'

const SessionSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: 'accessJWT',
      max: 20,
    },
    token: {
      type: String,
      required: true,
      default: null,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Session', SessionSchema)
