const txRequest = require("../../httpService/index");
const { isNumeric } = require('../../utils/verify')
// const moment = require('moment');
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
    leaderboardCategory = async (ctx, next) => {
        const uin = ctx.cookies.get('uin');
        let res = await txRequest.get({
            url: `https://u.y.qq.com/cgi-bin/musicu.fcg?_=1577086820633&data={%22comm%22:{%22g_tk%22:5381,%22uin%22:${uin},%22format%22:%22json%22,%22inCharset%22:%22utf-8%22,%22outCharset%22:%22utf-8%22,%22notice%22:0,%22platform%22:%22h5%22,%22needNewCode%22:1,%22ct%22:23,%22cv%22:0},%22topList%22:{%22module%22:%22musicToplist.ToplistInfoServer%22,%22method%22:%22GetAll%22,%22param%22:{}}}`,
        })
        ctx.body = { code: 200, data: res }
    }
    leaderboardDetail = async (ctx, next) => {
        let { id = 4, page = 1, pageSize = 100, period, time = new Date.format('yyyy-MM-dd') } = ctx.request.body;
        const uin = ctx.cookies.get('uin');
        let res = await txRequest.get({
            url: `https://u.y.qq.com/cgi-bin/musicu.fcg?_=1577086820633&data={%22comm%22:{%22g_tk%22:5381,%22uin%22:${uin},%22format%22:%22json%22,%22inCharset%22:%22utf-8%22,%22outCharset%22:%22utf-8%22,%22notice%22:0,%22platform%22:%22h5%22,%22needNewCode%22:1,%22ct%22:23,%22cv%22:0},%22topList%22:{%22module%22:%22musicToplist.ToplistInfoServer%22,%22method%22:%22GetAll%22,%22param%22:{}}}`,
        })
        ctx.body = { code: 200, data: 'res' }

        // const { id = 4, pageNo = 1, pageSize = 100, period, time = moment().format('YYYY-MM-DD'), raw } = req.query;
        // let timeType = '';
        // let postPeriod = (period || moment(time).format(timeType));
        // switch (Number(id)) {
        //     case 4:
        //     case 27:
        //     case 62:
        //         timeType = 'YYYY-MM-DD';
        //         break;
        //     default:
        //         timeType = 'YYYY_W';
        // }

        // const reqFunc = async () => request({
        //     url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        //     data: {
        //         g_tk: 5381,
        //         data: JSON.stringify({
        //             "detail": {
        //                 "module": "musicToplist.ToplistInfoServer",
        //                 "method": "GetDetail",
        //                 "param": {
        //                     "topId": Number(id),
        //                     "offset": (pageNo - 1) * pageSize,
        //                     "num": Number(pageSize),
        //                     "period": postPeriod,
        //                 },
        //             },
        //             "comm": { "ct": 24, "cv": 0 }
        //         }),
        //     },
        // });
        // let result = await reqFunc();

        // if (result.detail.data.data.period !== postPeriod) {
        //     postPeriod = result.detail.data.data.period;
        //     result = await reqFunc();
        // }
    }
}

module.exports = new Leaderboard()