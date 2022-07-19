function storeSessionUserData(keyvalue, sessionUserObject) {
    sessionStorage.setItem(keyvalue, JSON.stringify(sessionUserObject))
}

function readSessionUserData(keyvalue) {
    return JSON.parse(sessionStorage.getItem(keyvalue))
}

export { storeSessionUserData, readSessionUserData }
