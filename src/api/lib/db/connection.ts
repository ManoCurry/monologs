import * as mongoose from 'mongoose'
mongoose.Promise = global.Promise

const connectionURI = process.env.DB_URL

const connection = mongoose.createConnection(connectionURI)

connection.on('connecting', () => {
  // tslint:disable-next-line:no-console
  console.log('connecting to Mongoconnection...')
})

connection.on('error', (error) => {
  // tslint:disable-next-line:no-console
  console.error('Error in Mongoconnection connection: ' + error)
  mongoose.disconnect()
})
connection.on('connected', () => {
  // tslint:disable-next-line:no-console
  console.log('Mongoconnection connected!')
})
connection.once('open', () => {
  // tslint:disable-next-line:no-console
  console.log('Mongoconnection connection opened!')
})
connection.on('reconnected', () => {
  // tslint:disable-next-line:no-console
  console.log('Mongoconnection reconnected!')
})
connection.on('disconnected', () => {
  // tslint:disable-next-line:no-console
  console.log('Mongoconnection disconnected!')
})

export default connection
