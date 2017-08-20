import connection from './connection'
import UserSchema from './schemas/User'

export const User = connection.model('User', UserSchema)
