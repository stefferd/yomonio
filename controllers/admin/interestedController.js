const mongoose = require('mongoose');
const Interested = mongoose.model('Interested');

exports.home = async (req, res) => {
    const interested = await Interested.find();
    res.render('admin/interested', { title: 'E-mail\'s', interested });
};