const txRequest = require("../../httpService/index");
const { isNumeric } = require('../../utils/verify')
class Leaderboard {
    constructor() {
        this.regExps = {
            periodList: /<i class="play_cover__btn c_tx_link js_icon_play" data-listkey=".+?" data-listname=".+?" data-tid=".+?" data-date=".+?" .+?<\/i>/g,
            period: /data-listname="(.+?)" data-tid=".*?\/(.+?)" data-date="(.+?)" .+?<\/i>/,
        }
    }
    getLeaderboard = async (ctx, next) => {
        let res = await txRequest.get({ url: 'https://c.y.qq.com/node/pc/wk_v15/top.html' })
        let result = res.match(this.regExps.periodList)
        if (!result) return ctx.app.emit('error', 2001, ctx)
        let leaderboardList = []
        result.forEach(item => {
            let result = item.match(this.regExps.period)
            if (!result) return
            leaderboardList.push({
                name: result[1],
                bangid: result[2],
                period: result[3],
            })
        })
        ctx.body = { code: 200, data: leaderboardList }
    }
    getLeaderboardSong = async (ctx, next) => {
        const { leaderboardId, date, limit } = ctx.request.body
        if (!leaderboardId || !date || !limit) {
            return ctx.app.emit('error', 2002, ctx)
        }
        if (!isNumeric(leaderboardId) || !isNumeric(limit)) {
            return ctx.app.emit('error', 2003, ctx)
        }
        let res = await txRequest.post({
            url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)'
            },
            data: {
                toplist: {
                    module: 'musicToplist.ToplistInfoServer',
                    method: 'GetDetail',
                    param: {
                        topid: Number(leaderboardId),
                        num: Number(limit),
                        period: date,
                    }
                },
                comm: {
                    uin: 0,
                    format: 'json',
                    ct: 20,
                    cv: 1859
                }
            }
        })
        ctx.body = { code: 200, data: res.toplist.data }
    }
}

module.exports = new Leaderboard()