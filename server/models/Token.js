const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TokenSchema = new Schema({
    tokenId: {
        type: String,
    },
    iat: {
        type: Date,
    },
    valid: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Token', TokenSchema);
