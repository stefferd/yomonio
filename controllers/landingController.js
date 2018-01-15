const mongoose = require('mongoose');
const Page = mongoose.model('Page');
const Block = mongoose.model('Block');
const BlockItem = mongoose.model('BlockItem');
const Interested = mongoose.model('Interested');

exports.home = async (req, res) => {
    const page = await Page.findOne({ slug: '/'});
    const blocks = await Block.find({ page: page._id });
    const savedInterested = (req.body.savedInterested);
    res.render('index', { title: page.name, body: req.body, blocks, savedInterested });
};

exports.saveEmail = async (req, res, next) => {
    const interested = {
        email: req.body.email
    };
    await (new Interested(interested)).save();
    req.body.savedInterested = true;
    next();
};