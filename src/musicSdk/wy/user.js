const wyRequest = require("./utils/request");
const { cookieToJson } = require('./utils/index')
class User {
    //获取用户账号信息
    userAccount = async (ctx, next) => {
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/api/nuser/account/get',
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //获取用户详情
    userDetail = async (ctx, next) => {
        const { uid } = ctx.request.body
        if (!uid) return ctx.body = { code: 2400, data: '用户的UID不能为空~' }
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: `https://music.163.com/weapi/v1/user/detail/${uid}`,
            data
        });
        // const result = JSON.stringify(res).replace(
        //     /avatarImgId_str/g,
        //     'avatarImgIdStr',
        //   )
        ctx.body = { code: 200, data: res }
    }
    //获取用户详情
    userSubcount = async (ctx, next) => {
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/weapi/subcount',
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //获取用户歌单
    userSongList = async (ctx, next) => {
        const { uid, pageSize = 20, pageNo = 1 } = ctx.request.body
        if (!uid) return ctx.body = { code: 2400, data: '用户的UID不能为空~' }
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            uid,
            limit: pageSize,
            offset: pageNo - 1,
            includeVideo: true,
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/api/user/playlist',
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //获取用户历史评论
    userCommentHistory = async (ctx, next) => {
        const { uid, pageSize = 20, time = 0 } = ctx.request.body
        if (!uid) return ctx.body = { code: 2400, data: '用户的UID不能为空~' }
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            user_id: uid,
            limit: pageSize,
            time,//上一条数据的 time,第一页不需要传,默认为 0
            compose_reminder: 'true',
            compose_hot_comment: 'true',
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/api/comment/user/comment/history',
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //获取用户关注列表
    userFollows = async (ctx, next) => {
        const { uid, pageSize = 20, pageNo = 1 } = ctx.request.body
        if (!uid) return ctx.body = { code: 2400, data: '用户的UID不能为空~' }
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            limit: pageSize,
            offset: pageNo - 1,
            order: true,
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: `https://music.163.com/weapi/user/getfollows/${uid}`,
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //获取用户粉丝
    userFans = async (ctx, next) => {
        const { uid, pageSize = 20, pageNo = 1 } = ctx.request.body
        if (!uid) return ctx.body = { code: 2400, data: '用户的UID不能为空~' }
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            userId: uid,
            time: '0',
            limit: pageSize,
            offset: pageNo - 1,
            getcounts: 'true',
            options: {
                crypto: 'eapi',
                cookie: cookieObj || {},
                url: '/api/user/getfolloweds',
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: `https://music.163.com/eapi/user/getfolloweds/${uid}`,
            data
        });
        ctx.body = { code: 200, data: res }
    }
    //获取用户播放记录
    userPlayRecord = async (ctx, next) => {
        const { uid, type = 0 } = ctx.request.body
        if (!uid) return ctx.body = { code: 2400, data: '用户的UID不能为空~' }
        const cookieObj = cookieToJson(ctx.request.header.cookie)
        const data = {
            uid,
            type,
            options: {
                crypto: 'weapi',
                cookie: cookieObj || {},
                ua: '',
                proxy: '',
                realIP: '',
            }
        }
        const res = await wyRequest.post({
            url: 'https://music.163.com/weapi/v1/play/record',
            data
        });
        ctx.body = { code: 200, data: res }
    }
}

module.exports = new User()