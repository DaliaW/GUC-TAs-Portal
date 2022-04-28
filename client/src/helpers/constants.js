import axiosCall from './axiosCall';

const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;

require('dotenv').config();

var tmp;
if (process.env.NODE_ENV === "production")
    tmp = 'https://guc-cms.ahmedashraf.me/api/v1.0';
else
    tmp = `http://localhost:5000`;
export const link = tmp;

export function dateFormat(input) {
    const date = new Date(input)
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return year + "-" + month + "-" + day;
}

export async function checkHOD() {
    let found = false;
    const loggedInUser = localStorage.getItem("user");
    let user;
    if (loggedInUser) user = jwt.verify(loggedInUser, tokenKey);
    try {
        const depResult = await axiosCall("get", "departments/department/all/all");
        if (depResult.data.data) {
            let HOD = await depResult.data.data
                .filter((element) => element.HOD !== undefined)
                .forEach((element) => {
                    if (element.HOD === user.id) {
                        found = true;
                    } else {
                        found = false;
                    }
                    return found;
                });
        }
    } catch (err) {
        console.log("~err", err);
    }
    return found;
}