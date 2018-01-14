const mongoose = require('mongoose');
const randomstring = require('randomstring');
const Page = mongoose.model('Page');
const Block = mongoose.model('Block');
const BlockItem = mongoose.model('BlockItem');
const moment = require('moment');

exports.home = async (req, res) => {
    const pages = await Page.find();
    console.log(pages);
    res.render('admin/pages', { title: 'Pagina\'s', pages });
};

exports.validate = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'Geef een naam op!').notEmpty();
    req.checkBody('slug', 'Geef een slug op!').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('admin/pages', { title: 'Pagina\'s', body: req.body, flashes: req.flash() });
        return;
    }
    next();
};

exports.save = async (req, res) => {
    const page = await Page.findOne({slug: req.body.slug});

    if (!page) {
        const page = {
            name: req.body.name,
            slug: req.body.slug,
            active: req.body.active,
            author: req.user._id
        };
        const savedPage = await (new Page(page)).save();
        req.flash('success', 'Het aanmelden is gelukt, u kunt nu inloggen');
        res.render('admin/pages', { title: 'Pagina aangemaakt', body: req.body, flashes: req.flash(), savedPage, moment });
    } else {
        req.flash('error', 'Bestaat al een pagina met deze slug!');
        res.render('admin/pages', { title: 'Pagina\'s', body: req.body, flashes: req.flash() });
    }
};

exports.edit = async (req, res) => {
    const page = await Page.findOne({_id: req.params.id});
    const blocks = await Block.find({ page: req.params.id });

    if (page) {
        res.render('admin/page-edit', { title: 'Pagina bewerken', body: req.body, flashes: req.flash(), page, blocks });
    } else {
        res.redirect('admin/pages');
    }
};