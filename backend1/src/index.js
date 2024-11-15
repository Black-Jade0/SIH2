const express = require("express");
const cors = require("cors");
require('dotenv').config();
const PORT =  process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

// Import routers
const userRouter = require("./src/routes/user/user");

const eduRouter = require("./src/routes/edu");

// Use routers
app.use("/user", userRouter);
app.use("/admin", eduRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
