const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;


async function checkLogin() {
    try {
        const token = localStorage.getItem("user");
        if (token) {
            const userData = jwt.verify(token, tokenKey);
            return userData;
        }
        else {
            document.location.href = '/login'
        }
    } catch (err) {
        localStorage.removeItem("user");
        document.location.href = window.location.origin + "/login";
        console.log("~ err", err);
    }
}

export default checkLogin;