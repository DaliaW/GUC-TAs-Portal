const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DepartmentSchema = new Schema({
    faculty: {
        type: Schema.Types.ObjectId,
        ref: 'Faculty',
    },
    name: {
        type: String,
        required: true,
    },
    HOD: {
        type: Schema.Types.ObjectId,
        ref: 'StaffMember',
    },
});

module.exports = mongoose.model('Department', DepartmentSchema);
