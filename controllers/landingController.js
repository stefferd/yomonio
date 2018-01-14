// const mongoose = require('mongoose');

exports.home = (req, res) => {
    res.render('index', { title: 'App bla bla bla', body: req.body });
};