const mongoose = require('mongoose');

module.exports = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure; 1 means failure, 0 means success
    }
}