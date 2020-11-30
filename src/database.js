const mongoose = require('mongoose');

(async () => {
  try {
    const db = await mongoose.connect("mongodb://localhost:27017/walletdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected", db.connection.host);
  } catch (error) {
    console.error(error);
  }
})();
