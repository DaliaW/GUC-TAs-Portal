require('dotenv').config();
const axiosReq = require('axios');
require('dotenv').config();
var tmp;
if (process.env.NODE_ENV === "production")
  tmp = 'https://guc-cms.ahmedashraf.me/api/v1.0';
else
  tmp = `http://localhost:5000/`;
export const link = tmp;

export const axios = axiosReq.create({
  baseURL: tmp,
  headers: {
    'Content-type': 'application/json',
    'auth-token': localStorage.getItem('user'),
  },
});
