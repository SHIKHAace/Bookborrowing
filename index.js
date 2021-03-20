const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');
const connectDb = require('./dbconnect')
require('dotenv').config({ path: './config.env' })
const app = express()
const port = process.env.PORT || 5000
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const bookRoute = require('./routes/book')
connectDb().then(
    () => {
        console.log('Database Connected');
    },
    err => {
        console.log(`Database connection error: ${err}`)
    }
);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors({ origin: process.env.CLIENT }))
app.use(morgan('dev'))

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.use('/', authRoute)
app.use('/', userRoute)
app.use('/', bookRoute)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))