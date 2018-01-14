const passport = require('passport');
const crypto = require('crypto');
const promisify = require('es6-promisify');
const mongoose = require('mongoose');
const User = mongoose.model('User');


exports.home = (req, res) => {
    res.render('admin/dashboard', { title: 'Admin dashboard' });
};