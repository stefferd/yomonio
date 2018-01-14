const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const pageSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please provide a valid source name'
    },
    slug: {
        type: String,
        trim: true,
        required: 'Please provide a valid slug name'
    },
    active: {
        type: Boolean,
        default: false,
        required: 'Please provide if the page is active'
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

pageSchema.pre('find', autopopulate);
pageSchema.pre('findOne', autopopulate);

pageSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Page', pageSchema);

