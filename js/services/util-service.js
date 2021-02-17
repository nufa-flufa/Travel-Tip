export const utilService = {
    saveToStorage,
    loadFromStorage,
    getRandomId,
    copyTextToClipboard
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



function fallbackCopyTextToClipboard(text) {
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) { // ie
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}