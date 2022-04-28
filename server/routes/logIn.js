var express = require("express");
var router = express.Router();
const auth = require('../helpers/auth');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;

const Token = require('../models/Token');
const StaffMember = require('../models/StaffMember');

const validation = require('../helpers/validation');


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

router.post("", async function (req, res) {
    try {
        let JOI_Result = await validation.logInSchema.validateAsync(req.body)

        const { gucId, password } = req.body;

        if (!gucId || !password)
            return res.send({ error: "Please enter all details" });

        const staff = await StaffMember.findOne({ gucId: gucId });
        if (!staff)
            return res.status(400).json({ error: 'Wrong Id or password' });

        const match = bcrypt.compareSync(password, staff.password);
        //const match = true

        if (match) {
            let payload = {
                id: staff._id,
                gucId: staff.gucId,
                gender: staff.gender,
                name: staff.name,
                email: staff.email,
                dayOff: staff.dayOff,
                type: staff.type,
                role: staff.role,
                salary: staff.salary,
                officeLocation: staff.officeLocation,
                lastLogin: staff.lastLogIn,
                faculty: staff.type === 'Academic Member' ? staff.faculty : undefined,
                department: staff.type === 'Academic Member' ? staff.department : undefined
            }

            const token = jwt.sign(payload, tokenKey, { expiresIn: '1h' })
            await Token.create({ tokenId: token, iat: new Date() })

            if (!staff.lastLogIn) {
                console.log("not logged in before")
                await readline.question('Do you want to change your password (Y/N): ', async (answer) => {
                    if (answer === 'Y' || answer === 'y') {
                        await readline.question('New password: ', async (password) => {
                            if (password) {
                                console.log("creating...")
                                staff.password = await bcrypt.hash(password, 12);
                                staff.save();
                                console.log("changed password...")
                            } else {
                                console.log("password not changed...")
                            }
                            readline.close();
                        });
                    } else {
                        console.log("Password will not be changed");
                        readline.close();
                    }
                })

                // staff.lastLogIn = new Date();
                await staff.save();
                return res.header("auth-token", token).send({ token: token, fistLogIn: true, message: "PLEASE update your password in the console (later it will be handled in frontend)" });
            }

            staff.lastLogIn = new Date();
            await staff.save();
            return res.header("auth-token", token).send({ token: token, fistLogIn: false, lastLogIn: staff.lastLogIn });
        }
        else
            return res.status(400).send({ error: "Wrong Id or password" });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err.details[0].message });
        }
        console.log(err)
        return res.send({ error: err })
    }
}
);

module.exports = router;  