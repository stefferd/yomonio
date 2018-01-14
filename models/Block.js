const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const blockSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please provide a valid block name'
    },
    created: {
        type: Date,
        default: Date.now
    },
    sorting: {
        type: Number,
        required: 'Please provide a valid sorting'
    },
    page: {
        type: mongoose.Schema.ObjectId,
        ref: 'Page',
        required: 'You must supply an Page'
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an user'
    }
});

blockSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Block', blockSchema);

