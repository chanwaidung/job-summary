import instance from "../utils/request";

export function getData(data) {
    return instance({
        url: 'get-data',
        method: 'GET',
        data
    })
}

export function getAccessToken(data) {
    return instance({
        url: 'get-token',
        method: 'GET',
        data
    })
}
