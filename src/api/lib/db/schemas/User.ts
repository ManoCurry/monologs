import { Schema } from 'mongoose'

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  emails: {
    type: [{
      value: String,
    }],
    hidden: true,
    required: true,
  },
  githubId: {
    type: String,
    required: true,
  },
  githubName: {
    type: String,
    required: true,
  },
  photos: [{
    value: String,
  }],
})

export default User
