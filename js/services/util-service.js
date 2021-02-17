export const utilService = {
    saveToStorage,
    loadFromStorage,
    getRandomId
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    const json = localStorage.getItem(key)
    return JSON.parse(json)
}



function getRandomId() {
    return '_' + Math.random().toString(36).substr(2, 5);
}