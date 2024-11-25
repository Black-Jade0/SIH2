const express = require("express");
const cors = require("cors");
var cookieParser = require('cookie-parser')
require('dotenv').config();

//require('dotenv').config();
const PORT =  process.env.PORT || 3000;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));

// Import routers
const userRouter = require("./routes/user");

const eduRouter = require("./routes/edu");

// Use routers
app.use("/user", userRouter);
app.use("/edu", eduRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
