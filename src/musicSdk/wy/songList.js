const wyRequest = require("./utils/request");
const { cookieToJson } = require('./utils/index')
class SongList {
    //新建歌单
    songListAdd = async (ctx, next) => {
        const { privacy = 0, name, type = 'NORMAL' } = ctx.request.body
        if (!name) return ctx.body = { code: 2400, data: '歌单名字不能为空~' }
        let cookieObj = cookieToJson(ctx.request.header.cookie)
        cookieObj.os = 'pc'
        cookieObj.appver = '2.9.7'
        const data = {
            name,
            privacy,//0 为普通歌单，10 为隐私歌单
            type,//传 'VIDEO'则为视频歌单,传 'SHARED'则为共享歌单
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/api/playlist/create',
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //更新歌单信息
    songListUpdateInfo = async (ctx, next) => {
        const { id, name, desc = '', tags = '' } = ctx.request.body
        if (!id) return ctx.body = { code: 2400, data: '歌单Id不能为空~' }
        if (!name) return ctx.body = { code: 2400, data: '歌单名字不能为空~' }
        let cookieObj = cookieToJson(ctx.request.header.cookie)
        cookieObj.os = 'pc'
        cookieObj.appver = '2.9.7'
        const data = {
            '/api/playlist/desc/update': `{"id":${id},"desc":"${desc}"}`,
            '/api/playlist/tags/update': `{"id":${id},"tags":"${tags}"}`,
            '/api/playlist/update/name': `{"id":${id},"name":"${name}"}`,
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/weapi/batch',
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //更新歌单名字
    songListUpdateName = async (ctx, next) => {
        const { id, name } = ctx.request.body
        if (!id || !name) return ctx.body = { code: 2400, data: '歌单Id或者歌单名字不能为空~' }
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            id,
            name,
            options: {
                crypto: 'eapi',
                cookie: cookieObj || {},
                url: '/api/playlist/update/name',
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://interface3.music.163.com/eapi/playlist/update/name',
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //更新歌单封面
    songListUpdateCover = async (ctx, next) => {
        const { id, name } = ctx.request.body
        if (!id || !name) return ctx.body = { code: 2400, data: '歌单Id或者歌单名字不能为空~' }
        // const cookieObj = cookieToJson(ctx.request.header.cookie)
        // const data = {
        //     id,
        //     name,
        //     options: {
        //         crypto: 'eapi',
        //         cookie: cookieObj || {},
        //         url: '/api/playlist/update/name',
        //         ua: '',
        //         proxy: '',
        //         realIP: '',
        //     }
        // }
        // const res = await wyRequest.post({
        //     url: 'https://interface3.music.163.com/eapi/playlist/update/name',
        //     data
        // });
        ctx.body = { code: 200, data: 'res' }
    }
}

module.exports = new SongList()