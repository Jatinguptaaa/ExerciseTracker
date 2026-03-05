const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err))

const userSchema = new mongoose.Schema({
  username: String
})

const exerciseSchema = new mongoose.Schema({
  userId: String,
  description: String,
  duration: Number,
  date: Date
})

const User = mongoose.model("User", userSchema)
const Exercise = mongoose.model("Exercise", exerciseSchema)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

/*
-------------------------
CREATE USER
POST /api/users
-------------------------
*/
app.post('/api/users', async (req, res) => {

  const user = new User({
    username: req.body.username
  })

  const savedUser = await user.save()

  res.json({
    username: savedUser.username,
    _id: savedUser._id
  })

})

/*
-------------------------
GET ALL USERS
GET /api/users
-------------------------
*/

app.get('/api/users', async (req, res) => {

  const users = await User.find()

  res.json(users)

})

/*
-------------------------
ADD EXERCISE
POST /api/users/:_id/exercises
-------------------------
*/

app.post('/api/users/:_id/exercises', async (req, res) => {

  const userId = req.params._id
  const description = req.body.description
  const duration = Number(req.body.duration)

  let date = req.body.date
    ? new Date(req.body.date)
    : new Date()

  const exercise = new Exercise({
    userId,
    description,
    duration,
    date
  })

  await exercise.save()

  const user = await User.findById(userId)

if (!user) {
  return res.json({ error: "User not found" })
}

res.json({
  _id: user._id,
  username: user.username,
  description,
  duration,
  date: date.toDateString()
})

})

/*
-------------------------
GET USER LOG
GET /api/users/:_id/logs
-------------------------
*/

app.get('/api/users/:_id/logs', async (req, res) => {

  const userId = req.params._id
  const { from, to, limit } = req.query

  const user = await User.findById(userId)

  if (!user) {
    return res.json({ error: "User not found" })
  }

  let filter = { userId }

  if (from || to) {
    filter.date = {}
    if (from) filter.date.$gte = new Date(from)
    if (to) filter.date.$lte = new Date(to)
  }

  let exercises = Exercise.find(filter)

  if (limit) {
    exercises = exercises.limit(Number(limit))
  }

  const logs = await exercises

  const formattedLogs = logs.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }))

  res.json({
    username: user.username,
    count: formattedLogs.length,
    _id: user._id,
    log: formattedLogs
  })

})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})