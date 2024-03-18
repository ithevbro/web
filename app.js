const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('./public/index.html')
})
app.get('/zakuski', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/pages/zakuski.html'))
})
app.get('/hotdogs', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/pages/hotdogs.html'))
})

app.listen(PORT)