import axios from "axios";
import { ROOT_URL } from '../config'

async function login(form, cb) {
    try {
        const res = await axios.post(ROOT_URL + "/auth/basic", form);
        console.log(res)
        const user = { ...res.data.user };
        if (cb)
            cb(null, user);
    }
    catch (err) {
        console.error(`error => ${err}`)
    }
}


function logout() {
    // clearToken();
    window.location = "/login";
}

export { login, logout };