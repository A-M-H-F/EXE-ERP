const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        // await -//
        // public - process.env.MONGO_URI
        // local - process.env.MONGO_URI_LOCAL
        await mongoose.connect(process.env.MONGO_URI_LOCAL);

        console.log('Connected to MongoDB');

        //  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)

        // const db = mongoose.connection.db;
        // console.log(`Connected to database: ${db.databaseName}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = { connectDB }