const txRequest = require("../../httpService/txRequest");
class User {
    //获取用户主页信息 mymusic 为喜欢的音乐，mydiss 为用户创建的歌单，需要注意的是，喜欢的音乐中的歌单id为 id，歌单中的歌单id为 dissid
    getUserHome = async (ctx, next) => {
        const { id } = ctx.request.body
        if (!id) return ctx.body = { code: 2400, data: 'id不能为空~' }
        const res = await txRequest.get({
            url: 'http://c.y.qq.com/rsc/fcgi-bin/fcg_get_profile_homepage.fcg',
            params: {
                cid: 205360838, // 管他什么写死就好了
                userid: id, // qq号
                reqfrom: 1,
            }
        });
        if (res && res.code === 1000) return ctx.body = { code: 2400, data: '未登陆或者cooki过期了~' };
        ctx.body = { code: 200, data: res.data }
    }
    //获取用户创建的歌单信息
    getSongList = async (ctx, next) => {
        let { id } = ctx.request.body;
        if (!id) return ctx.body = { code: 2400, data: '用户ID不能为空~' }
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_user_created_diss',
            params: {
                hostUin: 0,
                hostuin: id,
                sin: 0,
                size: 200,
                g_tk: 5381,
                loginUin: 0,
                format: 'json',
                inCharset: 'utf8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'yqq.json',
                needNewCode: 0,
            },
            headers: {
                Referer: 'https://y.qq.com/portal/profile.html',
            },
        });
        ctx.body = { code: 200, data: res.data }
    }
    //获取用户收藏的歌单
    getCollectSongList = async (ctx, next) => {
        let { id, pageNo = 1, pageSize = 20 } = ctx.request.body;
        if (!id) return ctx.body = { code: 2400, data: '用户ID不能为空~' }
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/fav/fcgi-bin/fcg_get_profile_order_asset.fcg',
            params: {
                ct: 20,
                cid: 205360956,
                userid: id,
                reqtype: 3,
                sin: (pageNo - 1) * pageSize,
                ein: pageNo * pageSize,
            }
        });
        ctx.body = { code: 200, data: res.data }
    }
    //获取用户收藏的专辑
    getCollectAlbum = async (ctx, next) => {
        let { id, pageNo = 1, pageSize = 20 } = ctx.request.body;
        if (!id) return ctx.body = { code: 2400, data: '用户ID不能为空~' }
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/fav/fcgi-bin/fcg_get_profile_order_asset.fcg',
            params: {
                ct: 20,
                cid: 205360956,
                userid: id,
                reqtype: 2,
                sin: (pageNo - 1) * pageSize,
                ein: pageNo * pageSize - 1,
            }
        });
        ctx.body = { code: 200, data: res.data }
    }

    //获取用户关注的歌手
    getFollowSingers = async (ctx, next) => {
        let { id, pageNo = 1, pageSize = 20 } = ctx.request.body;
        if (!id) return ctx.body = { code: 2400, data: '用户ID不能为空~' }
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_getlist.fcg',
            params: {
                utf8: 1,
                page: pageNo,
                perpage: pageSize,
                uin: id,
                g_tk: 5381,
                format: 'json',
            }
        });
        ctx.body = { code: 200, data: res }
    }
    //操作用户关注/取消歌手 operation操作，0：关注，1：取消关注，默认为 0
    setFollowSingers = async (ctx, next) => {
        let { singermid, operation = 0 } = ctx.request.body;
        if (!singermid) return ctx.body = { code: 2400, data: '歌手ID不能为空~' }
        const urlMap = [
            'https://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_add.fcg',
            'https://c.y.qq.com/rsc/fcgi-bin/fcg_order_singer_del.fcg'
        ];
        const res = await txRequest.get({
            url: urlMap[operation],
            params: {
                g_tk: 5381,
                format: 'json',
                singermid,
            }
        });
        ctx.body = { code: 200, data: res }
    }
    //获取用户关注的用户(不可用)
    getFollowUsers = async (ctx, next) => {
        let { id, pageNo = 1, pageSize = 10 } = ctx.request.body;
        if (!id) return ctx.body = { code: 2400, data: '用户ID不能为空~' }
        const res = await txRequest.post({
            url: 'https://u6.y.qq.com/cgi-bin/musics.fcg?_=1719479890084&sign=zzb67593e77s7imcryx2gummhghunjrfw44f9763c',
            data: {
                comm: {
                    cv: 4747474,
                    ct: 24,
                    format: "json",
                    inCharset: "utf-8",
                    outCharset: "utf-8",
                    notice: 0,
                    platform: "yqq.json",
                    needNewCode: 1,
                    uin: id,
                    g_tk_new_20200303: 1647824963,
                    g_tk: 1647824963
                },
                req_1: {
                    module: "music.concern.RelationList",
                    method: "GetFollowUserList",
                    param: {
                        From: pageNo - 1,
                        Size: pageSize,
                        HostUin: "oKvk7wSi7KCFon**"
                    }
                }
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                Origin: 'https://y.qq.com',
                Referer: 'https://y.qq.com/',

            },
        });
        console.log("/*-*/", res,)
        // const result = await txRequest.get({
        //     url: 'https://c.y.qq.com/rsc/fcgi-bin/friend_follow_or_listen_list.fcg',
        //     data: {
        //       utf8: 1,
        //       start: (pageNo - 1) * pageSize,
        //       num: pageSize,
        //       uin: id,
        //       format: 'json',
        //       g_tk: 5381,
        //     }
        //   });
        ctx.body = { code: 200, data: res }
    }
    //获取用户的粉丝(不可用)
    getUserFans = async (ctx, next) => {
        let { id, pageNo = 1, pageSize = 20 } = ctx.request.body;
        if (!id) return ctx.body = { code: 2400, data: '用户ID不能为空~' }
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/rsc/fcgi-bin/friend_follow_or_listen_list.fcg',
            params: {
                utf8: 1,
                start: (pageNo - 1) * pageSize,
                num: pageSize,
                uin: id,
                format: 'json',
                g_tk: 5381,
                is_listen: 1,
            }
        });
        console.log("*-------------", res)
        ctx.body = { code: 200, data: res }
    }
}

module.exports = new User()