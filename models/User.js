const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: value => validator.isEmail(value),
            message: 'is not valid'
        }
    },
    name: {
        type: String,
        trim: true,
        required: 'Please provide a valid email address'
    },
    gender: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        default: 'member',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.virtual('gravatar').get(function() {
   const hash = md5(this.email);
   return `https://gravatar.com/avatar/${hash}?s=200`;
});

function autopopulate(next) {
    this.populate('sourceCode');
    next();
}

userSchema.pre('find', autopopulate);
userSchema.pre('findOne', autopopulate);

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);

