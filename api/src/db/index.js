const mongoose = require('mongoose')
const connectionString=process.env.MONGO_URI


const connectDB = async () => {
    try {
        // console.log("MongoDB URI:", process.env.MONGO_URI);
        const ConnectionString = await mongoose.connect(connectionString);
        console.log(`\nMongoDb connected DB host: ${ConnectionString.connection.host}`);
    } catch (error) {
        console.log("DB error:", error);
        process.exit(1);
    }
}


module.exports = {connectDB};
