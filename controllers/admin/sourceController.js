const mongoose = require('mongoose');
const randomstring = require('randomstring');
const Source = mongoose.model('Source');
const SourceCodes = mongoose.model('SourceCode');

exports.home = (req, res) => {
    res.render('admin/sources', { title: 'Bronnen' });
};

exports.validateSource = (req, res, next) => {
    req.sanitizeBody('sourceName');
    req.checkBody('sourceName', 'Geef een bron naam op!').notEmpty();
    req.checkBody('sourceCodesTotal', 'Geef het aantal broncodes op!').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('admin/sources', { title: 'Bronnen', body: req.body, flashes: req.flash() });
        return;
    }
    next();
};

exports.save = async (req, res) => {
    const amountOfSourceCodes = req.body.sourceCodesTotal;
    if (amountOfSourceCodes > 0) {
        const source = {
            name: req.body.sourceName,
            amount: req.body.sourceCodesTotal,
            author: req.user._id
        };
        const savedSource = await (new Source(source)).save();

        for(let currentGeneratedSourceCode = 0; currentGeneratedSourceCode < amountOfSourceCodes; currentGeneratedSourceCode++) {
            let tempSource = {
                code: randomstring.generate(10),
                used: false,
                source: savedSource._id
            };
            await (new SourceCodes(tempSource)).save();
        }

        req.flash('success', `Successfully created ${savedSource.name}. Care to leave a review?`);
    }
    res.redirect('/sources');
};