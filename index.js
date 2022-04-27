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
    // Server receives a call from the client then sends a call to client to update displays
    socket.on("updateCall", () => {
        console.log("1 Will update...")
        io.emit("updateNow");
    })
});
// ====================================================

server.listen(4000, () => {
    console.log("Server running on port 4000...")
});

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

// Get a specific poll
app.get("/polls/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const getPoll = await pool.query( 
            "SELECT * FROM polls WHERE poll_id = $1",
            [id]
        );
        res.json(getPoll.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all options for a poll
app.get("/options", async(req, res) => {
    try {
        const { poll_id } = req.query;
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
        const { title } = req.body;
        const pollId = await pool.query(
            "SELECT poll_id FROM polls ORDER BY poll_id DESC LIMIT 1"
        );
        const newOption = await pool.query(
            "INSERT INTO options(poll_id, title) VALUES($1, $2) RETURNING *",
            [pollId.rows[0].poll_id, title]
        );
        res.json(newOption.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all answers for an option
app.get("/answers", async(req, res) => {
    try {
        const { poll_id, option_id } = req.query;
        if (option_id) { 
            const getAnswers = await pool.query(
                "SELECT COUNT(*) FROM answers WHERE option_id = $1",
                [option_id]
            );
            res.json(getAnswers.rows);
        } else {
            const getAllAnswers = await pool.query(
                "SELECT COUNT(*) FROM answers WHERE poll_id = $1",
                [poll_id]
            );
            res.json(getAllAnswers.rows);
        } 
    } catch (err) {
        console.error(err.message);
    }
});

// Get all user's answer for a poll
app.get("/answers/user", async(req, res) => {
    try {
        const { poll_id, cookie } = req.query;
        const getUserAnswers = await pool.query(
            "SELECT * FROM answers WHERE poll_id = $1 AND cookie = $2",
            [poll_id, cookie]
        );
        res.json(getUserAnswers.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Cast a vote for an option
app.post("/answers", async(req, res) => {
    try {
        const { poll_id, option_id, cookie } = req.body;
        const newAnswer = await pool.query(
            "INSERT INTO answers(poll_id, option_id, cookie) VALUES($1, $2, $3) RETURNING *",
            [poll_id, option_id, cookie]
        );
        res.json(newAnswer.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Delete user's vote(s)
app.delete("/answers", async(req, res) => {
    try {
        const { poll_id, cookie } = req.query;
        await pool.query( 
            "DELETE FROM answers WHERE poll_id = $1 AND cookie = $2",
            [poll_id, cookie]
        );
    } catch (err) {
        console.error(err.message);
    }
});

