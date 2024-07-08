const txRequest = require("../../httpService/index");
const { changeUrlQuery } = require('./utils/StringHelper');
class SongList {
    //获取歌单的详情主页
    getSongListDetail = async (ctx, next) => {
        const { id } = ctx.request.body
        console.log("geddddd", id)
        if (!id) return ctx.body = { code: 2400, data: '歌单id不能为空~' }
        const res = await txRequest.get({
            url: 'http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
            params: {
                type: 1,
                utf8: 1,
                disstid: id, // 歌单的id
                loginUin: 0,
            },
            headers: {
                Referer: 'https://y.qq.com/n/yqq/playlist',
            },
        });
        // if (res && res.code === 1000) return ctx.body = { code: 2400, data: '未登陆或者cooki过期了~' };
        ctx.body = { code: 200, data: JSON.parse(res) }
    }
    //获取歌单分类的类别 返回几种类型下的小分类 id 和 name，不同于歌手的筛选，搜索歌单时只能用一个 id，不能用且关系
    getSongListCategory = async (ctx, next) => {
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg?format=json&inCharset=utf8&outCharset=utf-8',
            headers: {
                Referer: 'https://y.qq.com/'
            },
        });
        ctx.body = { code: 200, data: res.data }
    }
    //根据分类获取歌单 sort: 5: 推荐，2: 最新，其他数字的排列值最后都会返回推荐 category: 分类 id，默认 10000000 （全部）
    getCategorySongList = async (ctx, next) => {
        let { pageSize = 20, pageNo = 1, sort = 5, category = 10000000 } = ctx.request.body;
        // if (!id) return ctx.body = { code: 2400, data: '用户ID不能为空~' }
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
            params: {
                inCharset: 'utf8',
                outCharset: 'utf-8',
                sortId: sort,
                categoryId: category,
                sin: pageSize * (pageNo - 1),
                ein: pageNo * pageSize - 1,
            },
            headers: {
                Referer: 'https://y.qq.com',
            }
        });
        ctx.body = { code: 200, data: JSON.parse(res) }
    }
    //获取用户自己创建的歌单且只会返回歌曲的 id 和 mid 的哈希表 dirid: 默认 201 我喜欢的歌单
    getMySongList = async (ctx, next) => {
        let { dirid = 201 } = ctx.request.body;
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_musiclist_getmyfav.fcg',
            params: {
                dirid,
                dirinfo: 1,
                g_tk: 5381,
                format: 'json',
            },
            headers: {
                Referer: 'https://y.qq.com/n/yqq/playlist',
            },
        });
        ctx.body = { code: 200, data: res }
    }

    //(不可用)添加歌曲到歌单 mid: 歌曲 mid 必填，多个用 , 分割 dirid: 必填
    setAddSong = async (ctx, next) => {
        let { mid, dirid } = ctx.request.body;
        if (!mid || !dirid) return ctx.body = { code: 2400, data: '歌曲ID和歌单ID不能为空~' }
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_music_add2songdir.fcg',
            params: {
                midlist: mid,
                typelist: new Array(mid.split(',').length).fill(13).join(','),
                dirid,
                addtype: '',
                formsender: 4,
                r2: 0,
                r3: 1,
                utf8: 1,
                g_tk: 5381,
            }
        });
        ctx.body = { code: 200, data: res }
    }
    //(不可用)从歌单中移除歌曲 mid: 歌曲 mid 必填，多个用 , 分割 dirid: 必填 
    setDeleteSong = async (ctx, next) => {
        let { mid, dirid } = ctx.request.body;
        if (!mid || !dirid) return ctx.body = { code: 2400, data: '歌曲ID和歌单ID不能为空~' }
        let uin = ctx.cookies.get('uin')
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/qzone/fcg-bin/fcg_music_delbatchsong.fcg',
            params: {
                loginUin: uin,
                hostUin: 0,
                format: 'json',
                inCharset: 'utf8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'yqq.post',
                needNewCode: 0,
                uin: uin,
                dirid,
                ids: mid,
                source: 103,
                types: new Array(mid.split(',').length).fill(3).join(','),
                formsender: 4,
                flag: 2,
                utf8: 1,
                from: 3,
                g_tk: 5381,
            }
        });
        ctx.body = { code: 200, data: res }
    }
    //新建歌单
    setAddSongList = async (ctx, next) => {
        let { name } = ctx.request.body;
        if (!name) return ctx.body = { code: 2400, data: '歌单名字不能为空~' }
        let uin = ctx.cookies.get('uin')
        const res = await txRequest.post({
            url: 'https://c.y.qq.com/splcloud/fcgi-bin/create_playlist.fcg?g_tk=5381',
            data: changeUrlQuery({
                loginUin: uin,
                hostUin: 0,
                format: 'json',
                inCharset: 'utf8',
                outCharset: 'utf8',
                notice: 0,
                platform: 'yqq',
                needNewCode: 0,
                g_tk: 5381,
                uin: uin,
                name,
                show: 1,
                formsender: 1,
                utf8: 1,
                qzreferrer: 'https://y.qq.com/portal/profile.html#sub=other&tab=create&',
            }, '?').slice(1),
            headers: {
                Referer: 'https://y.qq.com/n/yqq/playlist',
            },
        });
        console.log("/*-*/", res,)
        ctx.body = { code: 200, data: res }
    }

    //删除歌单(有点问题)
    setDeleteSongList = async (ctx, next) => {
        let { dirid } = ctx.request.body;
        if (!dirid) return ctx.body = { code: 2400, data: '歌单ID不能为空~' }
        let uin = ctx.cookies.get('uin')
        const res = await txRequest.post({
            url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_fav_modsongdir.fcg?g_tk=5381',
            data: changeUrlQuery({
                loginUin: uin,
                hostUin: 0,
                format: 'fs',
                inCharset: 'GB2312',
                outCharset: 'gb2312',
                notice: 0,
                platform: 'yqq',
                needNewCode: 0,
                g_tk: 5381,
                uin: uin,
                delnum: 1,
                deldirids: dirid,
                forcedel: 1,
                formsender: 1,
                source: 103,
            }, '?').slice(1),
            headers: {
                Referer: 'https://y.qq.com/n/yqq/playlist',
            },
        });
        let obj = JSON.parse(res.replace(/(^.+\()|(\).+$)/g, ''))
        ctx.body = { code: 200, data: obj }
    }
    //收藏歌单  op: 1 收藏，2 取消收藏
    setCollectSongList = async (ctx, next) => {
        let { id, op } = ctx.request.body;
        if (!id || !op) return ctx.body = { code: 2400, data: '歌单ID和操作type不能为空~' }
        let uin = ctx.cookies.get('uin')
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/folder/fcgi-bin/fcg_qm_order_diss.fcg',
            params: {
                loginUin: uin,
                hostUin: 0,
                inCharset: 'GB2312',
                outCharset: 'utf8',
                platform: 'yqq',
                format: 'json',
                g_tk: 799643780,
                uin: uin,
                dissid: id,
                notice: 0,
                needNewCode: 0,
                from: 1,
                optype: op + '',
                utf8: 1,
                qzreferrer: `https://y.qq.com/n/yqq/playlist/${id}.html`,
            },
            headers: {
                Referer: `https://y.qq.com/n/yqq/playlist/${id}.html`,
                origin: 'https://imgcache.qq.com',
                'content-type': 'application/x-www-form-urlencoded',
            }
        });
        console.log("*-------------", res)
        ctx.body = { code: 200, data: res }
    }

    //获取为你推荐的歌单
    getRecommendUSongList = async (ctx, next) => {
        const res = await txRequest.get({
            url: 'http://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                data: JSON.stringify({
                    comm: {
                        ct: 24
                    },
                    recomPlaylist: {
                        method: "get_hot_recommend",
                        param: {
                            async: 1,
                            cmd: 2
                        },
                        module: "playlist.HotRecommendServer"
                    }
                })
            },
        });
        ctx.body = { code: 200, data: res }
    }
    //按分类推荐歌单 分类id，默认为 3317 // 3317: 官方歌单，59：经典，71：情歌，3056：网络歌曲，64：KTV热歌
    getRecommendSongList = async (ctx, next) => {
        let { pageSize = 20, pageNo = 1, id = 3317 } = ctx.request.body;
        const res = await txRequest.get({
            url: 'http://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                data: JSON.stringify({
                    comm: {
                        ct: 24
                    },
                    playlist: {
                        method: "get_playlist_by_category",
                        param: {
                            id: id / 1,
                            curPage: pageNo / 1,
                            size: pageSize / 1,
                            order: 5,
                            titleid: id / 1,
                        },
                        module: "playlist.PlayListPlazaServer"
                    }
                }),
            },
        });
        ctx.body = { code: 200, data: res }
    }
    //日推歌单
    getDailyRecommendSongList = async (ctx, next) => {
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/node/musicmac/v6/index.html',
        });
        let result = res.match(/<a href="javascript:;" data-type=".+?" data-rid=".+?" >今日私享<\/a>/g)
        if (result.length == 0) return ctx.body = { code: 2400, data: '出错了~' }
        let idList = result[0].match(/data-rid="([^"]+)"/)
        if (idList.length == 0) return ctx.body = { code: 2400, data: '出错了~' }
        ctx.request.body.id = idList[1]
        return this.getSongListDetail(ctx, next)
    }

    //日推的轮播图
    getDailyBanner = async (ctx, next) => {
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/node/musicmac/v6/index.html',
        });
        //和日推的处理差不多
    }

}

module.exports = new SongList()