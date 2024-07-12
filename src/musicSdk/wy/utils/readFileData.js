const jsonFile = require('jsonfile');
const fs = require('fs')
const path = require('path');
const parentDirectoryPath = path.dirname(__dirname)
class ReadFileData {
    constructor() {
        this.cookiesStr = ''
        this.visitorCookies = {}
    }

    getCookies = () => {
        try {
            this.visitorCookies = jsonFile.readFileSync(parentDirectoryPath + '/storageFile/visitorCookies.json')
            console.log("/*********", this.visitorCookies)
            return this.visitorCookies
        } catch (err) {
            // get allCookies failed
        }
    }
    setCookies = (cookie) => {
        this.visitorCookies = cookie
        jsonFile.writeFile(parentDirectoryPath + '/storageFile/visitorCookies.json', this.visitorCookies);
    }
    getDeviceidText = () => {
        const deviceidText = fs.readFileSync(
            parentDirectoryPath + '/storageFile/deviceid.txt',
            'utf-8',
        )
        const deviceidList = deviceidText.split('\n')
        return deviceidList
    }

}
module.exports = new ReadFileData();
