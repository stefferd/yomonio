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
    type: {
        type: String,
        trim: true,
        required: 'Please provide type'
    },
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an user'
    }
});

function autopopulate(next) {
    this.populate('author');
    next();
}

blockItemSchema.pre('find', autopopulate);
blockItemSchema.pre('findOne', autopopulate);

blockItemSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('BlockItem', blockItemSchema);

