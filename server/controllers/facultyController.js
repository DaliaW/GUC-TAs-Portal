const ObjectId = require('mongoose').Types.ObjectId;

const Faculty = require('../models/Faculty');
const Department = require('../models/Department');

const validation = require('../helpers/validation');

exports.getFaculty = async function (req, res) {
    try {
        if (req.params.code === "all") {
            const result = await Faculty.find();
            return res.send({ data: result });
        }
        else {
            const facCode = req.params.code;
            const result = await Faculty.findOne({ code: facCode });
            if (result)
                return res.send({ data: result });
            else
                return res.send({ error: "Sorry no faculty with this code" });
        }
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log("~ err", err);
        return res.send({ error: err })
    }
}

exports.addFaculty = async function (req, res) {
    try {
        let JOI_Result = await validation.facultySchema.validateAsync(req.body)

        let code = req.body.code;
        const name = req.body.name;

        code = code.toUpperCase();

        if (!name)
            return res.send({ error: "Please enter the name of the new faculty " });

        let facultyFound = await Faculty.findOne({ code: code })
        if (facultyFound)
            return res.send({ error: "Sorry there is another faculty with the same code" });

        facultyFound = await Faculty.findOne({ name: name })
        if (facultyFound)
            return res.send({ error: "Sorry there is another faculty with the same name" });


        const newFaculty = {
            code: code,
            name: name,
            departments: [],
        }

        const facultyCreated = await Faculty.create(newFaculty);
        return res.send({ data: facultyCreated });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
}

exports.updateFaculty = async function (req, res) {
    try {
        let JOI_Result = await validation.facultySchema.validateAsync(req.body)

        let code = req.body.code;
        const newName = req.body.newName;

        code = code.toUpperCase()

        if (!newName)
            return res.send({ error: "Please enter newName of the faculty" });

        const facultyFound = await Faculty.findOne({ code: code });
        if (!facultyFound)
            return res.send({ error: "No faculty with this code" });

        facultyFound.name = newName;

        const updatedFaculty = await facultyFound.save();
        return res.send({ data: "Faculty updated successfully" });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
}

exports.deleteFaculty = async function (req, res) {
    try {
        let JOI_Result = await validation.facultySchema.validateAsync(req.body)

        let code = req.body.code;
        code = code.toUpperCase();

        if (!code)
            return res.send({ error: "Please enter the code of the faculty" });

        const facultyFound = await Faculty.findOne({ code: code });
        if (!facultyFound)
            return res.send({ error: "Sorry no faculty with this code" });


        const departments = await Department.find({ faculty: facultyFound._id })
        for (let i = 0; i < departments.length; i++) {
            departments[i].faculty = undefined;
            await departments[i].save();
        }

        await Faculty.findOneAndDelete({ code: code });
        return res.send({ data: "Faculty deleted successfully " });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
}