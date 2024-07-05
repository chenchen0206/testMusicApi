const jsonFile = require('jsonfile');
const path = require('path');
const parentDirectoryPath = path.dirname(__dirname)
class GlobalData {
    constructor() {
        this.cookiesStr = ''
        this.allCookies = {}
    }

    getAllCookies = () => {
        try {
            this.allCookies = jsonFile.readFileSync(parentDirectoryPath + '/cookieFile/allCookies.json')
        } catch (err) {
            // get allCookies failed
        }
    }
    setAllCookies = (k, cookie) => {
        this.allCookies[k] = cookie
        jsonFile.writeFile(parentDirectoryPath + '/cookieFile/allCookies.json', this.allCookies);
    }

}
module.exports = new GlobalData();
