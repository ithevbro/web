const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
const { MongoClient } = require('mongodb')
const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)
const dbName = 'test'
let { arr, arr2 } = require('./data')
const router = express.Router()
const js = express.json()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/zakuski', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/hotdogs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/haha', js, (req, res) => {
    arr.push(req.body)
    res.send('loh')
})

app.get('/get', (req, res) => {
    res.send(JSON.stringify(arr));
})
app.get('/getzakuski', (req, res) => {
    res.send(JSON.stringify(arr2));
})
app.get('/gethotdogs', (req, res) => {
    res.send(JSON.stringify(arr));
})

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT)

// async function run() {
//     try {
//         const database = await client.db(dbName);
//         const hohol = await database.collection('hohol')
//         await hohol.insertOne(
//             {
//                 imgpath: 'burger.svg',
//                 price: 600,
//                 title: 'Мясная бомба',
//                 weight: '520г',
//                 description: 'blablablaba',
//                 ingredients: 'huyna'
//             }
//         )
//     } finally {
//         await client.close();
//     }
// }

// run().catch(console.dir);


