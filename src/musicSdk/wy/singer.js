const wyRequest = require("./utils/request");
const { cookieToJson } = require('./utils/index')
class Singer {
    //根据类别获取歌手
    //type 取值1:男歌手 2:女歌手 3:乐队
    //area 取值-1:全部 7:华语 96:欧美 8:日本 16:韩国 0:其他
    //initial 取值 A-Z 热门传-1,#传 0
    singerList = async (ctx, next) => {
        const { pageSize = 20, pageNo = 1, type = -1, area = -1, initial = -1 } = ctx.request.body
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            limit: pageSize,
            offset: pageNo - 1,
            total: true,
            type,
            area,
            initial: isNaN(initial) ? initial.charCodeAt() : initial,
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/api/v1/artist/list',
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //收藏/取消收藏歌手
    singerCollect = async (ctx, next) => {
        const { collect = 1, id } = ctx.request.body
        if (!id) return ctx.body = { code: 2400, data: '歌手ID不能为空~' }
        let collectStr = collect == 1 ? 'sub' : 'unsub'
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            artistId: id,
            artistIds: '[' + id + ']',
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: `https://music.163.com/weapi/artist/${collectStr}`,
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //歌手热门 50 首歌曲
    singerHotSong = async (ctx, next) => {
        const { id } = ctx.request.body
        if (!id) return ctx.body = { code: 2400, data: '歌手ID不能为空~' }
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            id,
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/api/artist/top/song',
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //歌手全部歌曲
    singerAllSong = async (ctx, next) => {
        const { pageSize = 20, pageNo = 1, type = -1, area = -1, initial = -1 } = ctx.request.body
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            limit: pageSize,
            offset: pageNo - 1,
            total: true,
            type,
            area,
            initial: isNaN(initial) ? initial.charCodeAt() : initial,
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/api/v1/artist/list',
            data
        });
        ctx.body = { code: 200, data: res }
    }
}

module.exports = new Singer()