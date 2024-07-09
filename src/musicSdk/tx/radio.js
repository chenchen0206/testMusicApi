const txRequest = require("../../httpService/index");
class Radio {
    //获取电台分类 或者 根据分类获取电台歌曲 默认99 => 猜你喜欢
    radioCategory = async (ctx, next) => {
        let { radiomid = 99 } = ctx.request.body;
        // if (!radiomid) return ctx.body = { code: 2400, data: '电台radiomid不能为空~' }
        let res = await txRequest.get({
            url: 'http://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                data: JSON.stringify({
                    songlist: {
                        module: "mb_track_radio_svr",
                        method: "get_radio_track",
                        param: {
                            id: id / 1,
                            firstplay: 1,
                            num: 15
                        },
                    },
                    radiolist: {
                        module: "pf.radiosvr",
                        method: "GetRadiolist",
                        param: {
                            ct: "24"
                        },
                    },
                    comm: {
                        ct: 24,
                        cv: 0
                    }
                })
            }
        })
        ctx.body = { code: 200, data: res }
    }
}

module.exports = new Radio()