const txRequest = require("../../httpService/index");
class Mv {
    //获取MV的信息
    mvInfo = async (ctx, next) => {
        let { mvmid } = ctx.request.body;
        if (!mvmid) return ctx.body = { code: 2400, data: 'MV的mvmid不能为空~' }
        let res = await txRequest.get({
            url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                data: JSON.stringify({
                    comm: {
                        ct: 24,
                        cv: 4747474,
                    },
                    mvinfo: {
                        module: 'video.VideoDataServer',
                        method: 'get_video_info_batch',
                        param: {
                            vidlist: [mvmid],
                            required: [
                                'vid',
                                'type',
                                'sid',
                                'cover_pic',
                                'duration',
                                'singers',
                                'video_switch',
                                'msg',
                                'name',
                                'desc',
                                'playcnt',
                                'pubdate',
                                'isfav',
                                'gmid',
                            ],
                        },
                    },
                    other: {
                        module: 'video.VideoLogicServer',
                        method: 'rec_video_byvid',
                        param: {
                            vid: mvmid,
                            required: [
                                'vid',
                                'type',
                                'sid',
                                'cover_pic',
                                'duration',
                                'singers',
                                'video_switch',
                                'msg',
                                'name',
                                'desc',
                                'playcnt',
                                'pubdate',
                                'isfav',
                                'gmid',
                                'uploader_headurl',
                                'uploader_nick',
                                'uploader_encuin',
                                'uploader_uin',
                                'uploader_hasfollow',
                                'uploader_follower_num',
                            ],
                            support: 1,
                        },
                    },
                }),
            }
        })
        ctx.body = { code: 200, data: res }
    }
    //获取MV的播放url 多个用,分割
    mvUrl = async (ctx, next) => {
        let { mvmid } = ctx.request.body;
        if (!mvmid) return ctx.body = { code: 2400, data: 'MV的mvmid不能为空~' }
        let res = await txRequest.get({
            url: 'http://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                data: JSON.stringify({
                    getMvUrl: {
                        module: 'gosrf.Stream.MvUrlProxy',
                        method: 'GetMvUrls',
                        param: {
                            vids: mvmid.split(','),
                            request_typet: 10001,
                        },
                    },
                }),
            }
        })
        ctx.body = { code: 200, data: res }
    }

    //获取MV分类
    mvCategory = async (ctx, next) => {
        let res = await txRequest.get({
            url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                data: JSON.stringify({
                    comm: { ct: 24 },
                    mv_tag: {
                        module: 'MvService.MvInfoProServer',
                        method: 'GetAllocTag',
                        param: {},
                    },
                }),
            }
        })
        ctx.body = { code: 200, data: res }
    }
    //根据分类获取MVList
    mvCategoryToList = async (ctx, next) => {
        let { page = 1, pageSize = 20, version = 7, area = 15 } = ctx.request.body;
        let res = await txRequest.get({
            url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
            params: {
                data: JSON.stringify({
                    comm: {
                        ct: 24,
                    },
                    mv_list: {
                        module: 'MvService.MvInfoProServer',
                        method: 'GetAllocMvInfo',
                        param: {
                            start: (page - 1) * pageSize,
                            size: pageSize / 1,
                            version_id: version / 1,
                            area_id: area / 1,
                            order: 1,
                        },
                    },
                }),
            }
        })
        ctx.body = { code: 200, data: res }
    }

    //MV点赞
    mvLike = async (ctx, next) => {
        let { mvmid, type = 1 } = ctx.request.body;
        if (!mvmid) return ctx.body = { code: 2400, data: 'MV的mvmid不能为空~' }
        const uin = ctx.cookies.get('uin');
        let res = await txRequest.get({
            url: 'https://c.y.qq.com/mv/fcgi-bin/fcg_add_del_myfav_mv.fcg',
            params: {
                uin,
                g_tk: 1157392233,
                format: 'json',
                inCharset: 'utf-8',
                outCharset: 'utf-8',
                cmdtype: Number(!Number(type)),
                reqtype: 1,
                mvidlist: mvmid,
                mvidtype: 0,
                cv: 4747474,
                ct: 24,
                notice: 0,
                platform: 'yqq.json',
                needNewCode: 1,
                g_tk_new_20200303: 1859542818,
                cid: 205361448,
            }
        })
        ctx.body = { code: 200, data: res }
    }
}

module.exports = new Mv()