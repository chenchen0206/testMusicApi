const txRequest = require("../../httpService/txRequest");
class Recommend {
    //新歌推荐 地区分类，默认为 0 // 0: 最新 1：内地，2：港台，3：欧美，4：韩国，5：日本
    getRecommendSong = async (ctx, next) => {
        let { type = 0 } = ctx.request.body;
        const newType = {
            0: 5, // 最新
            1: 1, // 内地
            2: 6, // 港台
            3: 2, // 欧美
            4: 4, // 韩国
            5: 3, // 日本
        }[type];
        if (!newType) return ctx.body = { code: 2400, data: 'Type不正确~' }

        let res = await txRequest.get({
            url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                data: JSON.stringify({
                    comm: {
                        ct: 24,
                    },
                    new_song: {
                        module: 'newsong.NewSongServer',
                        method: 'get_new_song_info',
                        param: {
                            type: newType,
                        },
                    },
                }),
            }
        })
        ctx.body = { code: 200, data: res }
    }
    //新专辑推荐 地区分类，默认为 1 // 1：内地，2：港台，3：欧美，4：韩国，5：日本，6：其他
    getRecommendAlbum = async (ctx, next) => {
        let { type = 1, num = 10, } = ctx.request.body;
        const typeName = {
            1: '内地',
            2: '港台',
            3: '欧美',
            4: '韩国',
            5: '日本',
            6: '其他',
        }[type];
        if (!typeName) return ctx.body = { code: 2400, data: 'Type不正确~' }
        const res = await txRequest.get({
            url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                platform: 'yqq.json',
                needNewCode: 0,
                data: JSON.stringify({
                    comm: {
                        ct: 24,
                    },
                    new_album: {
                        module: 'newalbum.NewAlbumServer',
                        method: 'get_new_album_info',
                        param: {
                            area: type / 1,
                            sin: 0,
                            num: num / 1,
                        },
                    },
                }),
            }
        });
        ctx.body = { code: 200, data: res }
    }
    //新 MV 推荐
    getRecommendMv = async (ctx, next) => {
        let { type = 0 } = ctx.request.body;
        const lan = {
            0: 'all',
            1: 'neidi',
            2: 'gangtai',
            3: 'oumei',
            4: 'korea',
            5: 'janpan',
        }[type];
        if (!lan) return ctx.body = { code: 2400, data: 'Type不正确~' }
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/mv/fcgi-bin/getmv_by_tag',
            params: {
                cmd: 'shoubo',
                lan,
            },
        });
        ctx.body = { code: 200, data: JSON.parse(res) }
    }
}

module.exports = new Recommend()