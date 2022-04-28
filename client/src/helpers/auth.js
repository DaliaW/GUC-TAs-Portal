const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;

async function auth(types) {
    const token = localStorage.getItem("user");

    let user
    if (token)
        user = jwt.verify(token, tokenKey);

    let found;
    if (user.type === "Academic Member")
        found = types.includes(user.role);
    else
        found = types.includes(user.type);

    if (found)
        return true;
    else {
        document.location.href = window.location.origin + '/unauthorized'
    }
}

export default auth;