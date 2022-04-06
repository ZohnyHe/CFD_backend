const express = require('express');
const app = express()
const path = require('path');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require('cors')
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'data')));


const { sequelize } = require('../models')

const routes = require('../src/routes/routes')
app.use('/routes', routes)


app.listen({ port: 8000 }, async () => {
    console.log(`Server up on http://localhost:8000`)
    await sequelize.authenticate()
    // await sequelize.sync({ force: true })
    console.log(`Database connected!`)
})

module.exports = app;