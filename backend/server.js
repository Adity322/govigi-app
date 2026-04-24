require("dotenv").config(); // ✅ MUST be first

const app = require("./src/app"); // ✅ import app
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000; // ✅ define PORT

const startServer = async () => {
  try {
    console.log("Connecting to database..."); // ✅ debug

    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();