const express           = require('express')
const app               = express()
const fs                = require('fs')
const cors              = require('cors')
const dotenv            = require('dotenv')
const mongoose          = require('mongoose')
const morgan            = require('morgan')
const bodyParser        = require('body-parser')
const cookieParser      = require('cookie-parser')
const expressValidator  = require('express-validator')

// Routes
const postRoutes        = require('./routes/post')
const authRoutes        = require('./routes/auth')
const userRoutes        = require('./routes/user')

dotenv.config()

// Database Connection
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})
    .then(() => console.log('DB is connect successfully'))
    .catch(err => console.log(`DB connection error : ${err.message}`))


// use middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator());
app.use(cors())

//home route
app.get('/', (req, res) => {
    fs.readFile('./docs/apiDocs.json', (err, data) => {
        if(err)
            return res.status(401).json({ error: err})
        
        const docs = JSON.parse(data)
        res.status(200).json(docs)
    })
})

// route handling
app.use('/', postRoutes)
app.use('/', authRoutes)
app.use('/', userRoutes)

// middleware for valid error message
app.use(function(err, req, res, next) {
    if(err.name === 'UnauthorizedError')
        res.status(401).json({ error: 'Invalid Token'})
})

// port
const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`server is listening at port ${port}`)
})