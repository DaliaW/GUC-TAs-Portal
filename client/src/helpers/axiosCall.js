import { axios } from "./axios";

export async function axiosCall(requestType, url, body) {
  try {
    const token = localStorage.getItem("user");
    let config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "auth-token": token,
      },
    };

    let result;
    switch (requestType) {
      case "get": {
        result = await axios.get(url, body, config);
        break;
      }
      case "post": {
        result = await axios.post(url, body);
        break;
      }
      case "put": {
        result = await axios.put(url, body);
        break;
      }
      case "delete": {
        result = await axios.delete(url, { data: body }, config);
        break;
      }
      case "patch": {
        result = await axios.patch(url, body);
        break;
      }
      default: {
        return "Wrong request type: can either be get, post, put, delete or patch";
      }
    }
    return result;
  } catch (error) {
    return { error: error.toString() };
  }
}

export default axiosCall;
