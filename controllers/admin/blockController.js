const mongoose = require('mongoose');
const Page = mongoose.model('Page');
const Block = mongoose.model('Block');
const BlockItem = mongoose.model('BlockItem');
const moment = require('moment');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That file type isn\'t allowed!' }, false);
        }
    }
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    // check if there is no new file to resize
    if (!req.file) {
        next();
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    // resize the image
    const photo = await jimp.read(req.file.buffer);
    await photo.write(`/public/uploads/${req.body.photo}`);
    // and continue!
    next();
};

exports.home = async (req, res) => {
    const pages = await Page.find();
    res.render('admin/pages', { title: 'Pagina\'s', pages, moment });
};

exports.add = (req, res) => {
    const blockId = req.params.id;

    res.render('admin/block-add', { title: 'Blok toevoegen', blockId});
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
    const blocks = await Block.find({page: req.params.id});
    const blockItems = [];
    console.log(req.body);
    if (req.body.template === 'hero') {
        const blockItemTitle = {
            name: 'hero-title',
            content: req.body.title,
            type: 'h1',
            author: req.user._id
        };
        let saveBlockItem = await(new BlockItem(blockItemTitle)).save();
        console.log(saveBlockItem, 'sbe savedBlockItem');
        blockItems.push(saveBlockItem._id);
        const blockItemText = {
            name: 'hero-text',
            content: req.body.text,
            type: 'p',
            author: req.user._id
        };
        let savedBlockItemText = await(new BlockItem(blockItemText)).save();
        blockItems.push(savedBlockItemText._id);
        const blockItemImage = {
            name: 'hero-image',
            content: req.body.image,
            type: 'img',
            author: req.user._id
        };
        let savedBlockItemImage = await(new BlockItem(blockItemImage)).save();
        blockItems.push(savedBlockItemImage._id);
    }
    console.log(blockItems,'sbe blockItems saved');

    const nextBlockSorting = blocks.length + 1;
    const block = {
        template: req.body.template,
        sorting: nextBlockSorting,
        page: req.params.id,
        author: req.user._id,
        blockItems: blockItems
    };
    await(new Block(block)).save();
    res.redirect(`/admin/pages/${req.params.id}`);
};

exports.edit = async (req, res) => {
    const page = await Page.findOne({_id: req.params.id});
    const blocks = await Block.find({ block: req.params.id });

    if (page) {
        res.render('admin/page-edit', { title: 'Pagina bewerken', body: req.body, flashes: req.flash(), page, blocks });
    } else {
        res.redirect('admin/pages');
    }
};