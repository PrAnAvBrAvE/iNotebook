const mongoose = require('mongoose')
const mongoURI = "mongodb://localhost:27017/inotebook"

const connectToMongo = async () => {
    try {
        mongoose.connect(mongoURI) 
        console.log('Mongo connected Successfully')
    }
    catch(error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectToMongo;