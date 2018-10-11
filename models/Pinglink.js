const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-beautiful-unique-validation');

const mongooseShema = mongoose.Schema;

const shema = new mongooseShema({
    link: {
        type: 'string',
        required: true,
        unique: 'link duplicated ({VALUE})'
    },
    status: {
        type: 'string'
    }
});

shema.plugin(uniqueValidator);

const PinglinkModule = mongoose.model('Pinglink', shema, 'Pinglink');

module.exports = PinglinkModule;