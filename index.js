const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db')

app.use(cors());
app.use(express.json());

app.listen(6000, () => {
    console.log("Server running on port 6000...")
});