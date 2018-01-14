// const mongoose = require('mongoose');
const fs = require('fs');
const fastCsv = require('fast-csv');

exports.home = (req, res) => {
    res.render('import', { title: 'convert', body: req.body });
};

exports.convert = (req, res) => {

    const fileStream = fs.createReadStream('./public/uploads/import-artiesten.csv');
    const parser = fastCsv();

    console.log(fileStream);

    fileStream
        .on('readable', function () {
            let data;
            while ((data = fileStream.read()) !== null) {
                parser.read(data);
                console.log(parser.read(data));
            }
        })
        .on('end', function () {
            parser.end();
            console.log('parser end');
        });

};
