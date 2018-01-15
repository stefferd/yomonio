const mongoose = require('mongoose');
const Page = mongoose.model('Page');
const Block = mongoose.model('Block');
const BlockItem = mongoose.model('BlockItem');

exports.home = async (req, res) => {
    const page = await Page.findOne({ slug: '/'});
    const blocks = await Block.find({ page: page._id });
    res.render('index', { title: page.name, body: req.body, blocks });
};