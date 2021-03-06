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
    await photo.write(`./public/uploads/${req.body.photo}`);
    // and continue!
    next();
};

exports.home = async (req, res) => {
    const pages = await Page.find();
    res.render('admin/pages', { title: 'Pagina\'s', pages, moment });
};

exports.add = (req, res) => {
    const pageId = req.params.id;

    res.render('admin/block-add', { title: 'Blok toevoegen', pageId, block: {}});
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

exports.saveBlockItems = async(req, res, next) => {
    const blockItems = [];
    console.log(req.body, 'hero');
    if (req.body.template === 'hero' || req.body.template === 'features') {
        const blockItemTitle = {
            name: 'hero-title',
            content: req.body.title,
            type: 'h1',
            author: req.user._id
        };
        let saveBlockItem = await(new BlockItem(blockItemTitle)).save();
        blockItems.push({ item: saveBlockItem._id});
        const blockItemText = {
            name: 'hero-text',
            content: req.body.text,
            type: 'p',
            author: req.user._id
        };
        let savedBlockItemText = await(new BlockItem(blockItemText)).save();
        blockItems.push({ item: savedBlockItemText._id });
        const blockItemImage = {
            name: 'hero-image',
            content: req.files.photo,
            type: 'img',
            author: req.user._id
        };
        let savedBlockItemImage = await(new BlockItem(blockItemImage)).save();
        blockItems.push({ item: savedBlockItemImage._id});
    } else if (req.body.template === 'preview') {
        const blockItemTitle = {
            name: 'hero-title',
            content: req.body.title,
            type: 'h1',
            author: req.user._id
        };
        let saveBlockItem = await(new BlockItem(blockItemTitle)).save();
        blockItems.push({ item: saveBlockItem._id});
        const blockItemImage = {
            name: 'hero-image',
            content: req.files.photo,
            type: 'img',
            author: req.user._id
        };
        let savedBlockItemImage = await(new BlockItem(blockItemImage)).save();
        blockItems.push({ item: savedBlockItemImage._id});
    }
    req.body.blockItems = blockItems;
    next();
};

exports.save = async (req, res) => {
    if (req.body.givenBlockId !== '') {
        const operator = '$addToSet';
        if (req.body.template === 'hero' || req.body.template === 'features') {
            const blockItemTitle = {
                name: 'hero-title',
                content: req.body.title,
                type: 'h1',
                author: req.user._id
            };
            let saveBlockItem = await(new BlockItem(blockItemTitle)).save();
            await Block.findByIdAndUpdate(
                req.body.givenBlockId,
                { [operator]: { items: saveBlockItem._id }},
                { new: true}
            );
            const blockItemText = {
                name: 'hero-text',
                content: req.body.text,
                type: 'p',
                author: req.user._id
            };
            let savedBlockItemText = await(new BlockItem(blockItemText)).save();
            await Block.findByIdAndUpdate(
                req.body.givenBlockId,
                { [operator]: { items: savedBlockItemText._id }},
                { new: true}
            );
            const blockItemImage = {
                name: 'hero-image',
                content: req.body.photo,
                type: 'img',
                author: req.user._id
            };
            let savedBlockItemImage = await(new BlockItem(blockItemImage)).save();
            await Block.findByIdAndUpdate(
                req.body.givenBlockId,
                { [operator]: { items: savedBlockItemImage._id }},
                { new: true}
            );
        } else if (req.body.template === 'preview') {
            const blockItemTitle = {
                name: 'hero-title',
                content: req.body.title,
                type: 'h1',
                author: req.user._id
            };
            let saveBlockItem = await(new BlockItem(blockItemTitle)).save();
            await Block.findByIdAndUpdate(
                req.body.givenBlockId,
                { [operator]: { items: saveBlockItem._id }},
                { new: true}
            );
            const blockItemImage = {
                name: 'hero-image',
                content: req.body.photo,
                type: 'img',
                author: req.user._id
            };
            let savedBlockItemImage = await(new BlockItem(blockItemImage)).save();
            await Block.findByIdAndUpdate(
                req.body.givenBlockId,
                { [operator]: { items: savedBlockItemImage._id }},
                { new: true}
            );
        }
    } else {
        const blocks = await Block.find({page: req.params.id});
        const nextBlockSorting = blocks.length + 1;
        const block = {
            template: req.body.template,
            sorting: nextBlockSorting,
            page: req.params.id,
            author: req.user._id,
            blockItems: req.body.blockItems
        };
        await(new Block(block)).save();
    }

    res.redirect(`/admin/pages/${req.params.id}`);
};

exports.edit = async (req, res) => {
    const block = await BlockItem.findOne({ _id: req.params.blockId });
    if (block) {
        res.render('admin/block-edit', {
            title: 'Blok bewerken',
            body: req.body,
            flashes: req.flash(),
            blockId: req.params.blockId,
            block
        });
    } else {
        res.redirect('admin/pages');
    }
};

exports.editContent = async (req, res) => {
    const page = await Page.findOne({_id: req.params.pageId});
    const block = await Block.findOne({ _id: req.params.blockId });
    console.log(page, block);
    if (page) {
        res.render('admin/block-add', {
            title: 'Blok bewerken',
            body: req.body,
            flashes: req.flash(),
            page,
            blockId: req.params.blockId,
            pageId: req.params.pageId,
            block
        });
    } else {
        res.redirect('admin/pages');
    }
};

exports.update = async (req, res) => {
    const block = await BlockItem.findOne({ _id: req.params.blockId });
    console.log(req.body, block);
    if (block) {
        if (block.type !== 'img') {
            block.content = req.body.content;
            await block.save();
            res.redirect('/admin/pages');
        }
    } else {
        res.redirect('admin/pages');
    }
};

exports.remove = async (req, res) => {
    await Block.findOne({ _id: req.params.blockId }).remove();
    res.redirect('/admin/pages');
};