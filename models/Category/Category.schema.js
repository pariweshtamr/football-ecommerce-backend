import mongoose from 'mongoose'

const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: '',
    },
    slug: {
      type: String,
      required: true,
      default: '',
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Category', CategorySchema)
