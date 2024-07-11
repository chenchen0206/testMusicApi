const txRequest = require("../../httpService/txRequest");
class Comment {
    //获取评论参数：
    // id: singid, albumid, tid, topid, vid 必填
    // type: 默认 0  0：获取最新评论，1：获取热评
    // biztype: 获取评论类型 1: 歌曲 2: 专辑 3: 歌单 4: 排行榜 5: mv
    // 当 page 为 1 且 type 为 0 时，会返回15条热评 hot_comment
    // 返回结果说明：ispraise 表示这条评论是否被赞过，1: 是，0: 否；enable_delete 表示这条评论是否能被删除，1: 是，0: 否
    commentNewAndHot = async (ctx, next) => {
        let { id, page = 1, pageSize = 20, type = 1, biztype = 1 } = ctx.request.body;
        if (!id) return ctx.body = { code: 2400, data: 'id不能为空~' }
        let uin = ctx.cookies.get('uin')
        let cmd = {
            1: [8, 6], // 歌曲
            2: [8, 9], // 专辑
            3: [8, 9], // 歌单
            4: [8, 9], // 排行榜
            5: [8, 6], // mv
        }[biztype][type]
        let res = await txRequest.get({
            url: 'http://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg',
            params: {
                biztype,
                topid: id,
                loginUin: uin,
                cmd,
                pagenum: page - 1,
                pagesize: pageSize,
            }
        })
        ctx.body = { code: 200, data: res }
    }
    //发送评论
    commentSend = async (ctx, next) => {
        let { id, biztype, content } = ctx.request.body;
        if (!id || !biztype || !content) return ctx.body = { code: 2400, data: '必填项不能为空~' }
        if (content.length > 300) return ctx.body = { code: 2400, data: '话有点多了,不能超过300~' }
        let uin = ctx.cookies.get('uin')
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg',
            params: {
                g_tk: 1157392233,
                loginUin: uin,
                hostUin: 0,
                format: 'json',
                inCharset: 'utf8',
                outCharset: 'GB2312',
                cmd: 1,
                reqtype: 2,
                biztype,
                topid: id,
                content: encodeURIComponent(content),
            },
            headers: {
                Referer: 'https://y.qq.com',
            },
        });
        ctx.body = { code: 200, data: res }
    }

    //删除评论 只要登陆情况下，一般这个接口返回的都是操作成功，不管 id 是否存真实在（是鹅厂这样返回的！）
    commentDelete = async (ctx, next) => {
        let { id } = ctx.request.body;
        if (!id) return ctx.body = { code: 2400, data: 'ID不能为空~' }
        let uin = ctx.cookies.get('uin')
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg',
            params: {
                g_tk: 1157392233,
                loginUin: uin,
                hostUin: 0,
                format: 'json',
                inCharset: 'utf8',
                outCharset: 'GB2312',
                cmd: 3,
                commentid: id,
            }
        });
        ctx.body = { code: 200, data: res }
    }
    //点赞评论 type: 1：点赞，2：取消赞，默认 1
    commentLike = async (ctx, next) => {
        let { id, type = 1 } = ctx.request.body;
        if (!id) return ctx.body = { code: 2400, data: 'ID不能为空~' }
        let uin = ctx.cookies.get('uin')
        const res = await txRequest.get({
            url: 'https://c.y.qq.com/base/fcgi-bin/fcg_global_comment_praise_h5.fcg',
            params: {
                g_tk: 1157392233,
                loginUin: uin,
                format: 'json',
                inCharset: 'utf8',
                outCharset: 'GB2312',
                cmd: type,
                reqtype: 2,
                commentid: id,
            }
        });
        ctx.body = { code: 200, data: res }
    }
}

module.exports = new Comment()