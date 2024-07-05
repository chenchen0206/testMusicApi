function parseCookies(cookieHeader) {
    const cookies = {};
    if (cookieHeader) {
        const pairs = cookieHeader.split(';');
        pairs.forEach(pair => {
            const [key, value] = pair.split('=').map(item => item.trim());
            cookies[key] = decodeURIComponent(value);
        });
    }
    return cookies;
}

module.exports = {
    parseCookies
}