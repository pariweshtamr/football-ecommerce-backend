import CategorySchema from './Category.schema.js'

export const addCategory = (newCategory) => {
  return CategorySchema(newCategory).save()
}

export const getAllCategories = () => {
  return CategorySchema.find()
}
export const getACategory = (_id) => {
  return CategorySchema.findById(_id)
}
