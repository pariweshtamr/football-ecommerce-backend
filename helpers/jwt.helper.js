import jwt from 'jsonwebtoken'
import { storeSession } from '../models/Session/Session.model.js'
import { setRefreshJWT } from '../models/User/User.model.js'

const createAccessJWT = async (userInfo) => {
  const token = jwt.sign(userInfo, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  })
  //STORE IN DB
  const result = await storeSession({ type: 'accessJWT', token })

  if (result?._id) {
    return token
  }
  return
}

const createRefreshJWT = async (_id, username) => {
  const token = jwt.sign({ username }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  })
  //STORE IN DB
  const result = await setRefreshJWT(_id, token)

  if (result?._id) {
    return token
  }
  return
}

export const getJWTs = async ({ _id, username }) => {
  if (!_id && !username) {
    return false
  }
  const accessJWT = await createAccessJWT({ username })
  const refreshJWT = await createRefreshJWT(_id, username)
  return { accessJWT, refreshJWT }
}
