const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
const { MongoClient } = require('mongodb')
const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)
const dbName = 'test'


async function run() {
    try {
        const database = await client.db(dbName);
        const hohol = await database.collection('hohol')
        await hohol.insertOne(
            {
                imgpath: 'burger.svg',
                price: 600,
                title: 'Мясная бомба',
                weight: '520г',
                description: 'blablablaba',
                ingredients: 'huyna'
            }
        )
    } finally {
        await client.close();
    }
}

run().catch(console.dir);

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