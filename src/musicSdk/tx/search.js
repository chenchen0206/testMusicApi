const txRequest = require("./utils/request");
class Search {
    //全局搜索
    getSearch = async (ctx, next) => {
        let {
            pageNo = 1,
            pageSize = 20,
            key,
            t = 0, // 0：单曲，2：歌单，7：歌词，8：专辑，9：歌手，12：mv
        } = ctx.request.body;
        if (!key) return ctx.body = { code: 2400, data: '关键词不能为空~' }

        const typeMap = {
            0: 'song',
            2: 'songlist',
            7: 'lyric',
            8: 'album',
            9: 'singer',
            12: 'mv',
        };
        if (!typeMap[t]) return ctx.body = { code: 2400, data: '搜索类型错误，检查一下参数 t~' }

        const url = {
            // 0: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
            2: `https://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist?remoteplace=txt.yqq.playlist&page_no=${pageNo - 1
                }&num_per_page=${pageSize}&query=${key}`,
            // 3: 'http://c.y.qq.com/soso/fcgi-bin/client_search_user',
        }[t] || 'http://c.y.qq.com/soso/fcgi-bin/client_search_cp';
        let params = {
            format: 'json', // 返回json格式
            n: pageSize, // 一页显示多少条信息
            p: pageNo, // 第几页
            w: key, // 搜索关键词
            cr: 1, // 不知道这个参数什么意思，但是加上这个参数你会对搜索结果更满意的
            g_tk: 5381,
            t,
        };
        if (Number(t) === 2) {
            params = {
                query: key,
                page_no: pageNo - 1,
                num_per_page: pageSize,
            };
        }
        let res = await txRequest.get({
            url,
            headers: {
                Referer: 'https://y.qq.com',
            },
            params
        })
        ctx.body = { code: 200, data: res.data }
    }
    //获取热搜词 k 为热搜词，n 为搜索量
    getTrendingSearch = async (ctx, next) => {
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
        });
        ctx.body = { code: 200, data: res.data }
    }
    //快速搜索
    getQuickSearch = async (ctx, next) => {
        let { key } = ctx.request.body;
        if (!key) return ctx.body = { code: 2400, data: '关键词不能为空~' }
        const res = await txRequest.get({
            url: `https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?key=${key}&g_tk=5381`,
        });
        ctx.body = { code: 200, data: res.data }
    }
}

module.exports = new Search()