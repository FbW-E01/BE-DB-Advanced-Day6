import mongoose from 'mongoose';
import express from 'express';

// Register mongoose connection event listeners
mongoose.connection.on("error",        er => console.log("ERROR", er))
mongoose.connection.on("connected",    () => console.log("connected"))
mongoose.connection.on("disconnected", () => console.log("disconnected"))

// Create Schema and Model
const messageSchema = new mongoose.Schema({
    author: { type: String, minLength: 3 },
    content: String
});
const Message = mongoose.model("messages", messageSchema);

// Connect to MongoDB
const connString = "mongodb://jimmy:passw0rd@localhost:27017/exampledb";
await mongoose.connect(connString);

// Set up express server
const app = express();

// Add express routes / endpoints
app.get("/messages", async (req, res) => {
    const allMessages = await Message.find({});
    res.json(allMessages);
});

app.delete("/messages", async (req, res) => {
    // Clear the database of old messages
    await Message.deleteMany({});
    res.json({ msg: "OK" });
});

app.post("/messages", async (req, res) => {
    // Insert new message to database
    await Message.create({ author: "Joel", content: "Hello" });
    res.json({ msg: "OK" });
});

app.put("/messages/:messageID", async (req, res, next) => {
    try {
        // Update existing document in database - METHOD 2
        const msg = await Message.findOne({ _id: req.params.messageID });

        if (!msg) {
            const e = new Error("Message not found at all!!");
            e.status = 404;
            next(e);
            return;
        }

        const update = { author: "Milad" };
        const options = { new: true, runValidators: true };
        await Message.findByIdAndUpdate(msg._id, update, options);
        res.json({ msg: "OK" });
    } catch (err) {
        next(err);
    }
});

// TODO: Add global path missing handler or "404" handler here

// Global error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500)
       .json({ message: err.message });
});

// Start express server listening
app.listen(3007, () => {
    console.log("App is listening to requests on http://localhost:3007")
})