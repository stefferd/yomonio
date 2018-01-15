const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const blockSchema = new Schema({
    template: {
        type: String,
        trim: true,
        required: 'Please provide a valid block template'
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
    },
    items: [ { type: mongoose.Schema.ObjectId, ref: 'BlockItem' } ]
});

function autopopulate(next) {
    this.populate('author');
    this.populate('page');
    this.populate('items');
    next();
}

blockSchema.pre('find', autopopulate);
blockSchema.pre('findOne', autopopulate);

blockSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Block', blockSchema);

