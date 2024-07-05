function isNumeric(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
}

module.exports = {
    isNumeric
}