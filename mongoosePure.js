import mongoose from 'mongoose'; // esm import

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

// Clear the database of old messages
await Message.deleteMany({});

// Insert messages to database
const inserted = await Message.create({ author: "Joel", content: "Hello" });

// Get newly inserted message from database
let msg = await Message.findOne();

// Update existing document in database - METHOD 1
msg.content = "Updated!!!!";
msg = await msg.save();

// Update existing document in database - METHOD 2
try {
    const update = { author: "X" };
    const options = { new: true, runValidators: true };
    const updated = await Message.findByIdAndUpdate(inserted._id, update, options);
    console.log(updated);
} catch (error) {
    console.log("Oh no, error during update", error.message);
}

await mongoose.disconnect();