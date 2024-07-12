const txRequest = require("./utils/request");
class Singer {
    //获取歌手的一些详细信息介绍
    singerIntroduce = async (ctx, next) => {
        let { singermid } = ctx.request.body;
        if (!singermid) return ctx.body = { code: 2400, data: '歌手singermid不能为空~' }
        let res = await txRequest.get({
            url: 'http://c.y.qq.com/splcloud/fcgi-bin/fcg_get_singer_desc.fcg',
            params: {
                singermid,
                format: 'xml',
                utf8: 1,
                outCharset: 'utf-8',
            },
            headers: {
                Referer: 'https://y.qq.com',
            }
        })
        ctx.body = { code: 200, data: res }
    }
    //获取歌手的热门歌曲
    singerHotSong = async (ctx, next) => {
        let { singermid, pageSize = 20, page = 1 } = ctx.request.body;
        if (!singermid) return ctx.body = { code: 2400, data: '歌手singermid不能为空~' }
        const res = await txRequest.get({
            url: 'http://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                data: JSON.stringify({
                    comm: {
                        ct: 24,
                        cv: 0
                    },
                    singer: {
                        method: "get_singer_detail_info",
                        param: {
                            sort: 5,
                            singermid,
                            sin: (page - 1) * pageSize,
                            num: pageSize,
                        },
                        module: "music.web_singer_info_svr"
                    }
                })
            }
        });
        ctx.body = { code: 200, data: res }
    }
    //获取歌手专辑
    singerAlbum = async (ctx, next) => {
        let { singermid, pageSize = 20, page = 1 } = ctx.request.body;
        if (!singermid) return ctx.body = { code: 2400, data: '歌手singermid不能为空~' }
        const res = await txRequest.get({
            url: 'http://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                data: JSON.stringify({
                    comm: {
                        ct: 24,
                        cv: 0
                    },
                    singerAlbum: {
                        method: "get_singer_album",
                        param: {
                            singermid,
                            order: "time",
                            begin: (page - 1) * pageSize,
                            num: pageSize / 1,
                            exstatus: 1
                        },
                        module: "music.web_singer_info_svr"
                    }
                })
            }
        });
        ctx.body = { code: 200, data: res }
    }
    //获取歌手Mv
    singerMv = async (ctx, next) => {
        let { singermid, pageSize = 20, page = 1 } = ctx.request.body;
        if (!singermid) return ctx.body = { code: 2400, data: '歌手singermid不能为空~' }
        const res = await txRequest.get({
            url: 'http://c.y.qq.com/mv/fcgi-bin/fcg_singer_mv.fcg',
            params: {
                singermid,
                order: 'time',
                begin: (page - 1) * pageSize,
                num: pageSize,
                cid: 205360581,
            }
        });
        ctx.body = { code: 200, data: res }
    }
    //相似歌手
    singerSimilarity = async (ctx, next) => {
        let { singermid } = ctx.request.body;
        if (!singermid) return ctx.body = { code: 2400, data: '歌手singermid不能为空~' }
        const res = await txRequest.get({
            url: 'http://c.y.qq.com/v8/fcg-bin/fcg_v8_simsinger.fcg',
            params: {
                singer_mid: singermid,
                num: 10,
                utf8: 1,
            }
        });
        ctx.body = { code: 200, data: res }
    }
    //歌手的分类 或者根据分类获取歌手
    singerCategory = async (ctx, next) => {
        let { area = -100, sex = -100, genre = -100, index = -100, page = 1, } = ctx.request.body;
        const res = await txRequest.get({
            url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                data: JSON.stringify({
                    comm: { ct: 24, cv: 0 },
                    singerList: {
                        module: "Music.SingerListServer",
                        method: "get_singer_list",
                        param: {
                            area: area / 1,
                            sex: sex / 1,
                            genre: genre / 1,
                            index: index / 1,
                            sin: (page - 1) * 80,
                            cur_page: page / 1,
                        }
                    }
                })
            }
        });
        ctx.body = { code: 200, data: res }
    }
}

module.exports = new Singer()