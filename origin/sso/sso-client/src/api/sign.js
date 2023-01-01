import instance from "../utils/request";

export function signIn(data) {
    return instance({
        url: 'sign-in',
        method: 'POST',
        data
    })
}
