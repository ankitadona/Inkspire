require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const dns = require("node:dns/promises");
dns.setServers(["8.8.8.8", "1.1.1.1"]);


connectDB();


const PORT = process.env.PORT || 3000;


app.listen(3000, () => {
  console.log(`Server running on ${PORT}`);
})