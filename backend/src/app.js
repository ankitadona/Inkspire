const express = require('express');
const authRoutes = require("./routes/auth.routes");
const cookieParser =  require("cookie-parser");
const cors = require("cors");   
const noteRoutes = require("./routes/note.routes")
const taskRoutes = require("./routes/task.routes")

const app = express();
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
}));
app.use("/api/auth",authRoutes);
app.use("/api/notes",noteRoutes);
app.use("/api/tasks",taskRoutes)

module.exports = app;