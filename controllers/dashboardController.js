const mongoose = require('mongoose');
const User = mongoose.model('User');


exports.home = (req, res) => {
    if (req.user.type === 'admin') {
        res.redirect('/admin');
    }
    res.render('dashboard', { title: 'Dashboard' });
};