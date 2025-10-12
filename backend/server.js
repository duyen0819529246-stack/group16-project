const express = require("express");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// ✅ Route test
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// ✅ Routes khác
const userRouter = require("./routes/user");
app.use("/users", userRouter);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

