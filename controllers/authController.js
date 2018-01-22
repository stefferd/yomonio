const passport = require('passport');
const crypto = require('crypto');
const promisify = require('es6-promisify');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const mail = require('./../handlers/email');

exports.login = passport.authenticate('local', {
    failureRedirect: '/admin/login',
    failureFlash: 'Failed login!',
    successRedirect: '/admin/interested',
    successFlash: 'You are now logged in!'
});

exports.log = (req, res, next) => {
    console.log('between steps');
    next();
};

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/admin/login');
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    req.flash('error', 'Oops! you must be logged in to do that!');
    res.redirect('/admin/login');
};

exports.isAdmin = (req, res, next) => {
    if (req.user.type === 'admin') {
        next();
        return;
    }
    req.flash('error', 'Oops! you must be an admin to view the requested page');
    res.redirect('/admin/login');
};

exports.forgot = async (req, res) => {
    // See if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('success', 'A password reset has been mailed to you!');
        return res.redirect('/admin/login');
    }
    // Set reset tokens and expiry on their account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();
    // Send them an email with the token
    const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
        user,
        subject: 'Password reset',
        resetUrl,
        filename: 'password-reset'
    });
    req.flash('success', `You have been email a password reset link.`);
    // Redirect to login page
    res.redirect('/login');
};

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired');
        return res.redirect('/login');
    }
    res.render('reset', { title: 'Reset your password' });
};

exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']) {
        next();
        return;
    }
    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
};

exports.update = async (req, res) => {
    // find the user and are still within the leap of time
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired');
        return res.redirect('/login');
    }
    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Nice! Your password has been reset! You are now logged in!');
    res.redirect('/');
};