const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/userRoute");
require("dotenv").config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/users', router);


// mongoose connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));  