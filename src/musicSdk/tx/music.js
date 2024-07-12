const txRequest = require("./utils/request");
const { changeUrlQuery } = require('./utils/StringHelper');
const Base64 = require('js-base64');
class Music {
    //获取音乐播放的URL
    getMusicUrl = async (ctx, next) => {
        const { songId } = ctx.request.body
        if (!Array.isArray(songId) || songId.length == 0) return ctx.app.emit('error', 2003, ctx)
        const { cookie } = ctx.request.header
        // const uin = ctx.cookies.get('uin');
        // const fqm_sessionid = ctx.cookies.get('fqm_sessionid');
        // const ts_uid = ctx.cookies.get('ts_uid');
        // const pgv_pvid = ctx.cookies.get('pgv_pvid');
        // if (!uin && !fqm_sessionid && !ts_uid && !pgv_pvid) return ctx.app.emit('error', 2004, ctx)
        if (!cookie) return ctx.app.emit('error', 2004, ctx)
        const uin = cookie.replace(/\D/g, '');
        const idStr = songId.map(id => `"${id}"`).join(',');
        let url = `https://u.y.qq.com/cgi-bin/musicu.fcg?-=getplaysongvkey&g_tk=5381&loginUin=${uin}&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B"req_0"%3A%7B"module"%3A"vkey.GetVkeyServer"%2C"method"%3A"CgiGetVkey"%2C"param"%3A%7B"guid"%3A"2796982635"%2C"songmid"%3A%5B${idStr}%5D%2C"songtype"%3A%5B0%5D%2C"uin"%3A"${uin}"%2C"loginflag"%3A1%2C"platform"%3A"20"%7D%7D%2C"comm"%3A%7B"uin"%3A${uin}%2C"format"%3A"json"%2C"ct"%3A24%2C"cv"%3A0%7D%7D`;

        let isOk = false;
        let result = null;
        let count = 0;
        const reqFun = async () => {
            count += 1;
            result = await txRequest.get({ url });
            if (result.req_0.data.testfile2g) {
                isOk = true;
            }
        };
        while (!isOk && count < 5) {
            await reqFun().catch(() => (count += 1));
        }
        if (!result || !result.req_0) return ctx.app.emit('error', 2005, ctx)

        const domain = result.req_0.data.sip.find(i => !i.startsWith('http://ws')) || result.req_0.data.sip[0];
        // domain = 'http://122.226.161.16/amobile.music.tc.qq.com/';

        const data = {};
        result.req_0.data.midurlinfo.forEach(item => {
            if (item.purl) {
                data[item.songmid] = `${domain}${item.purl}`;
            }
        });
        ctx.body = { code: 200, data: data }
    }

    //（不可用）获取歌曲的下载链接
    // id: songmid
    // type: 默认 128 // 128：mp3 128k，320：mp3 320k，m4a：m4a格式 128k，flac：flac格式 无损，ape：ape格式 无损
    // mediaId: 这个字段为其他接口中返回的 strMediaId 字段，可不传，不传默认同 songmid，但是部分歌曲不传可能会出现能获取到链接，但实际404， 所以有条件的大家都传吧
    // isRedirect: 默认 0，非 0 时直接重定向到播放链接
    // 这个接口跟上个接口一样，也是依赖服务器的 Cookie 信息的，不支持批量获取，不一定是全部的歌曲都有无损、高品的， 要注意结合 size320，sizeape，sizeflac 等参数先判断下是否有播放链接
    musicDownloadUrl = async (ctx, next) => {
        const { id, type = '128', mediaId, isRedirect = '0' } = ctx.request.body
        if (!id || !mediaId) return ctx.app.emit('error', 2003, ctx)
        const { cookie } = ctx.request.header
        if (!cookie) return ctx.app.emit('error', 2004, ctx)
        const typeMap = {
            m4a: {
                s: 'C400',
                e: '.m4a',
            },
            128: {
                s: 'M500',
                e: '.mp3',
            },
            320: {
                s: 'M800',
                e: '.mp3',
            },
            ape: {
                s: 'A000',
                e: '.ape',
            },
            flac: {
                s: 'F000',
                e: '.flac',
            },
        };
        const typeObj = typeMap[type];
        if (!typeObj) return ctx.body = { code: 2400, data: 'type传错了~' }
        const file = `${typeObj.s}${id}${mediaId}${typeObj.e}`;
        const guid = (Math.random() * 10000000).toFixed(0);
        let uin = ctx.cookies.get('uin')
        let qqmusic_key = ctx.cookies.get('qqmusic_key')
        let purl = '';
        let count = 0;
        let domain = '';
        while (!purl && count < 10) {
            count += 1;
            const result = await txRequest.get({
                url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
                data: {
                    '-': 'getplaysongvkey',
                    g_tk: 5381,
                    loginUin: uin,
                    hostUin: 0,
                    format: 'json',
                    inCharset: 'utf8',
                    outCharset: 'utf-8¬ice=0',
                    platform: 'yqq.json',
                    needNewCode: 0,
                    data: JSON.stringify({
                        req_0: {
                            module: 'vkey.GetVkeyServer',
                            method: 'CgiGetVkey',
                            param: {
                                filename: [file],
                                guid: guid,
                                songmid: [id],
                                songtype: [0],
                                uin: uin,
                                loginflag: 1,
                                platform: '20',
                            },
                        },
                        comm: {
                            uin: uin,
                            format: 'json',
                            ct: 19,
                            cv: 0,
                            authst: qqmusic_key,
                        },
                    }),
                },
            });
            if (!result.req_0.data) {
                return ctx.body = { code: 2400, data: '获取链接出错，建议检查是否携带 cookie ' }
            }
            if (result.req_0 && result.req_0.data && result.req_0.data.midurlinfo) {
                purl = result.req_0.data.midurlinfo[0].purl;
            }
            if (domain === '') {
                domain =
                    result.req_0.data.sip.find(i => !i.startsWith('http://ws')) ||
                    result.req_0.data.sip[0];
            }
        }
        if (!purl) {
            return ctx.body = { code: 2400, data: '获取播放链接出错' }
        }

        ctx.body = { code: 200, data: '测试' }
    }

    //获取歌曲信息
    getSongInfo = async (ctx, next) => {
        let { songmid } = ctx.request.body;
        if (!songmid) return ctx.body = { code: 2400, data: '歌曲ID不能为空~' }
        const data = {
            data: JSON.stringify({
                songinfo: {
                    method: 'get_song_detail_yqq',
                    module: 'music.pf_song_detail_svr',
                    param: {
                        song_mid: songmid,
                    },
                },
            }),
        };
        const res = await txRequest.get({
            url: changeUrlQuery(data, 'http://u.y.qq.com/cgi-bin/musicu.fcg'),
        });
        ctx.body = { code: 200, data: res.songinfo }
    }
    //获取相似歌曲
    getSimilarSong = async (ctx, next) => {
        let { songmid } = ctx.request.body;
        if (!songmid) return ctx.body = { code: 2400, data: '歌曲ID不能为空~' }
        const res = await txRequest.post({
            url: 'http://u.y.qq.com/cgi-bin/musicu.fcg',
            data: JSON.stringify({
                comm: {
                    g_tk: 5381,
                    format: 'json',
                    inCharset: 'utf-8',
                    outCharset: 'utf-8',
                    notice: 0,
                    platform: 'h5',
                    needNewCode: 1,
                },
                simsongs: {
                    module: 'rcmusic.similarSongRadioServer',
                    method: 'get_simsongs',
                    param: {
                        songid: Number(songmid),
                    },
                },
            }),
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        ctx.body = { code: 200, data: res }
    }
    //获取歌曲相关歌单
    getRelatedSongList = async (ctx, next) => {
        let { songmid } = ctx.request.body;
        if (!songmid) return ctx.body = { code: 2400, data: '歌曲ID不能为空~' }
        const res = await txRequest.post({
            url: 'http://u.y.qq.com/cgi-bin/musicu.fcg',
            data: JSON.stringify({
                comm: {
                    g_tk: 5381,
                    format: 'json',
                    inCharset: 'utf-8',
                    outCharset: 'utf-8',
                    notice: 0,
                    platform: 'h5',
                    needNewCode: 1,
                },
                gedan: {
                    module: 'music.mb_gedan_recommend_svr',
                    method: 'get_related_gedan',
                    param: {
                        sin: 0,
                        last_id: 0,
                        song_type: 1,
                        song_id: Number(songmid),
                    },
                },
            }),
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        ctx.body = { code: 200, data: res }
    }
    //获取歌曲相关歌单
    getRelatedMv = async (ctx, next) => {
        let { songmid } = ctx.request.body;
        if (!songmid) return ctx.body = { code: 2400, data: '歌曲ID不能为空~' }
        const res = await txRequest.post({
            url: 'http://u.y.qq.com/cgi-bin/musicu.fcg',
            data: JSON.stringify({
                comm: {
                    g_tk: 5381,
                    format: 'json',
                    inCharset: 'utf-8',
                    outCharset: 'utf-8',
                    notice: 0,
                    platform: 'h5',
                    needNewCode: 1,
                },
                gedan: {
                    module: 'MvService.MvInfoProServer',
                    method: 'GetSongRelatedMv',
                    param: {
                        songid: songmid,
                        songtype: 1,
                        lastmvid: 0,
                        num: 10,
                    },
                },
            }),
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        ctx.body = { code: 200, data: res }
    }

    //获取歌曲相关歌单
    getSongLyric = async (ctx, next) => {
        let { songmid } = ctx.request.body;
        if (!songmid) return ctx.body = { code: 2400, data: '歌曲ID不能为空~' }
        const res = await txRequest.get({
            url: 'http://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
            params: {
                songmid,
                pcachetime: new Date().getTime(),
                g_tk: 5381,
                loginUin: 0,
                hostUin: 0,
                inCharset: 'utf8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'yqq',
                needNewCode: 0,
            },
            headers: {
                Referer: 'https://y.qq.com',
            }
        });
        let jsonObj = JSON.parse(res)
        jsonObj.lyric = Base64.Base64.decode(jsonObj.lyric);
        jsonObj.trans = Base64.Base64.decode(jsonObj.trans || '');
        ctx.body = { code: 200, data: jsonObj }
    }

}

module.exports = new Music()