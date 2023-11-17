const { default: mongoose } = require("mongoose");

ConnectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected :${conn.connection.host}`);
};

module.exports = ConnectDB;
