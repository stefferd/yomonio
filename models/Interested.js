const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const interestedSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});


interestedSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Interested', interestedSchema);

