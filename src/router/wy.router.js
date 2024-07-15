const KoaRouter = require('@koa/router')

const { loginEmail, setCookie, loginVisitor, loginQrKey, loginQrCreate, loginQrCheck, loginStatus,
    logout } = require('../musicSdk/wy/login')
const { userAccount, userDetail, userSubcount, userSongList, userCommentHistory, userFollows, userFans
} = require('../musicSdk/wy/user')
const { songListAdd, songListUpdateName, songListUpdateInfo, songListUpdateCover } = require('../musicSdk/wy/songList')
const { singerList, singerCollect, singerHotSong } = require('../musicSdk/wy/singer')


const wyRouter = new KoaRouter({ prefix: '/wy' })

wyRouter.post('/login/email', loginEmail)
wyRouter.post('/login/setCookie', setCookie)
wyRouter.post('/login/visitor', loginVisitor)
wyRouter.post('/login/qrKey', loginQrKey)
wyRouter.post('/login/qrCreate', loginQrCreate)
wyRouter.post('/login/qrCheck', loginQrCheck)
wyRouter.post('/login/status', loginStatus)
wyRouter.post('/login/out', logout)

wyRouter.post('/user/account', userAccount)
wyRouter.post('/user/detail', userDetail)
wyRouter.post('/user/subcount', userSubcount)
wyRouter.post('/user/songList', userSongList)
wyRouter.post('/user/commentHistory', userCommentHistory)
wyRouter.post('/user/follows', userFollows)
wyRouter.post('/user/fans', userFans)


wyRouter.post('/songList/updateName', songListUpdateName)
wyRouter.post('/songList/add', songListAdd)
wyRouter.post('/songList/updateInfo', songListUpdateInfo)
wyRouter.post('/songList/updateCover', songListUpdateCover)

wyRouter.post('/singer/list', singerList)
wyRouter.post('/singer/collect', singerCollect)
wyRouter.post('/singer/hotSong', singerHotSong)


module.exports = wyRouter