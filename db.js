const mongoose = require('mongoose');  

const connection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Database connected');
    } catch (error) {
        console.log('Error connecting to the database');
    }
}

module.exports = {connection};