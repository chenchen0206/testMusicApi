const txRequest = require("../../httpService/txRequest");
class Album {
    //(不可用)获取专辑信息
    albumIntroduce = async (ctx, next) => {
        let { albummid } = ctx.request.body;
        if (!albummid) return ctx.body = { code: 2400, data: '专辑albummid不能为空~' }
        let res = await txRequest.get({
            url: `https://y.qq.com/n/yqq/album/${albummid}.html`,
        })
        ctx.body = { code: 200, data: res }
        // const pageInfo = await request(`https://y.qq.com/n/yqq/album/${albummid}.html`, { dataType: 'raw' });
        // console.log("*----------", pageInfo)
        // const $ = cheerio.load(pageInfo);
        // let albumInfo = {};
        // try {
        //     $('script').each((i, content) => {
        //         content.children.forEach(({ data = '' }) => {
        //             if (data.includes('window.__USE_SSR__')) {
        //                 const { detail } = eval(data.replace(/window\.__/g, 'window__'));
        //                 albumInfo = {
        //                     ...detail,
        //                     name: detail.albumName,
        //                     subTitle: detail.title,
        //                     ar: detail.singer,
        //                     mid: detail.albumMid,
        //                     publishTime: detail.ctime,
        //                 }
        //                 delete albumInfo.singer;
        //                 delete albumInfo.albumMid;
        //             }
        //         })
        //     })
        // } catch (err) {
        //     console.log(err);
        // }
    }
    //获取专辑内歌曲
    albumSongList = async (ctx, next) => {
        let { albummid } = ctx.request.body;
        if (!albummid) return ctx.body = { code: 2400, data: '专辑albummid不能为空~' }
        const res = await txRequest.get({
            url: 'https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&format=json&inCharset=utf8&outCharset=utf-8',
            params: {
                data: JSON.stringify({
                    comm: {
                        ct: 24,
                        cv: 10000
                    },
                    albumSonglist: {
                        method: "GetAlbumSongList",
                        param: {
                            albumMid: albummid,
                            albumID: 0,
                            begin: 0,
                            num: 999,
                            order: 2
                        },
                        module: "music.musichallAlbum.AlbumSongList"
                    }
                })
            }
        });
        ctx.body = { code: 200, data: res }
    }
}

module.exports = new Album()