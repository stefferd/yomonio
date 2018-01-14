const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const blockItemSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please provide a name'
    },
    content: {
        type: String,
        trim: true,
        required: 'Please provide content'
    },
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an user'
    },
    block: {
        type: mongoose.Schema.ObjectId,
        ref: 'Block',
        required: 'You must supply an block'
    }
});

blockItemSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('BlockItem', blockItemSchema);

