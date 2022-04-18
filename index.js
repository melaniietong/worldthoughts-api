const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');


// ======== SOCKET ====================================

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET"]
    }
});

io.on("connection", (socket) => {
    console.log("Connected");

    // Server receives a call from the client then sends a call to client to update displays
    socket.on("updateCall", () => {
        console.log("1 Will update...")
        socket.emit("updateNow");
    })
});

server.listen(4000, () => {
    console.log("Server running on port 4000...")
});

// ====================================================

app.use(cors());
app.use(express.json());

// Get all polls
app.get("/polls", async(req, res) => {
    try {
        const getPolls = await pool.query(
            "SELECT * FROM polls"
        );
        res.json(getPolls.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Create a poll
app.post("/polls", async(req, res) => {
    try {
        const { question, is_single } = req.body;
        const newPoll = await pool.query(
            "INSERT INTO polls(question, is_single) VALUES($1, $2) RETURNING *",
            [question, is_single]
        );
        res.json(newPoll.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get a random poll
app.get("/polls/random", async(req, res) => {
    try {
        const getRanPoll = await pool.query(
            "SELECT * FROM polls ORDER BY RANDOM() LIMIT 1"
        );
        res.json(getRanPoll.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all options for a poll
app.get("/options", async(req, res) => {
    try {
        const { poll_id } = req.body;
        const getOptions = await pool.query(
            "SELECT * FROM options WHERE poll_id = $1",
            [poll_id]
        );
        res.json(getOptions.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Create a options for a poll
app.post("/options", async(req, res) => {
    try {
        const { poll_id, title } = req.body;
        const newOption = await pool.query(
            "INSERT INTO options(poll_id, title) VALUES($1, $2) RETURNING *",
            [poll_id, title]
        );
        res.json(newOption.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all answers for an option
app.get("/answers", async(req, res) => {
    try {
        const { option_id } = req.body;
        const getAnswers = await pool.query(
            "SELECT * FROM answers WHERE option_id = $1",
            [option_id]
        );
        res.json(getAnswers.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Cast a vote for an option
app.post("/answers", async(req, res) => {
    try {
        const { option_id, cookie } = req.body;
        const newAnswer = await pool.query(
            "INSERT INTO answers(option_id, cookie) VALUES($1, $2) RETURNING *",
            [option_id, cookie]
        );
        res.json(newAnswer.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Update a user's vote
app.put("/answers/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { option_id } = req.body;
        await pool.query( 
            "UPDATE answers SET option_id = $1 WHERE answer_id = $2",
            [option_id, id]
        );
    } catch (err) {
        console.error(err.message);
    }
});

