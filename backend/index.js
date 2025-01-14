
const express = require('express')
const cors = require('cors')
const connectToMongo = require('./db');

// const express = require('express');

// // Call connectToMongo to establish the database connection
// connectToMongo();

// const app = express();
// const port = 5001;

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });



connectToMongo();

const app = express();
const port = 5000;


app.use(cors());
app.use(express.json())

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello Avani!')
})

// app.get('/api/v1/login', (req, res) => {
//   res.send('Hello login!')
// })

// app.get('/api/v1/signup', (req, res) => {
//   res.send('Hello signup!')
// })

app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})