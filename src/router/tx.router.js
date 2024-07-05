const KoaRouter = require('@koa/router')
const { getLeaderboard, getLeaderboardSong } = require('../musicSdk/tx/leaderboard')
const { getMusicUrl } = require('../musicSdk/tx/music')
const { setCookie, getCookie, refreshCookie } = require('../musicSdk/tx/login')
const { getUserHome, getSongList, getCollectSongList, getCollectAlbum, getFollowSingers, setFollowSingers, getFollowUsers, getUserFans } = require('../musicSdk/tx/user')
const { getSearch, getTrendingSearch, getQuickSearch } = require('../musicSdk/tx/search')
const { getSongListDetail, getSongListCategory, getCategorySongList, getMySongList, setAddSong, setDeleteSong, setAddSongList, setDeleteSongList, setCollectSongList } = require('../musicSdk/tx/songList')


const { globalCookieFun, takeCookieFun } = require('../musicSdk/tx/middleware')

const txRouter = new KoaRouter({ prefix: '/tx' })
txRouter.use(takeCookieFun)

txRouter.get('/leaderboard', getLeaderboard)
txRouter.post('/leaderboard/getSong', getLeaderboardSong)

txRouter.post('/music/getUrl', getMusicUrl)

txRouter.post('/login/setCookie', globalCookieFun, setCookie)
txRouter.post('/login/getCookie', globalCookieFun, getCookie)
txRouter.post('/login/refresh', globalCookieFun, refreshCookie)

txRouter.post('/user/detail', getUserHome)
txRouter.post('/user/songList', getSongList)
txRouter.post('/user/collectSongList', getCollectSongList)
txRouter.post('/user/collectAlbum', getCollectAlbum)
txRouter.post('/user/followSingers', getFollowSingers)
txRouter.post('/user/followCancel', setFollowSingers)
txRouter.post('/user/followUsers', getFollowUsers)
txRouter.post('/user/fans', getUserFans)

txRouter.post('/search', getSearch)
txRouter.post('/search/hot', getTrendingSearch)
txRouter.post('/search/quick', getQuickSearch)

txRouter.post('/songlist/detail', getSongListDetail)
txRouter.post('/songlist/category', getSongListCategory)
txRouter.post('/songlist/categorySongList', getCategorySongList)
txRouter.post('/songlist/mySongList', getMySongList)
txRouter.post('/songlist/addSong', setAddSong)
txRouter.post('/songlist/deleteSong', setDeleteSong)
txRouter.post('/songlist/addSongList', setAddSongList)
txRouter.post('/songlist/deleteSongList', setDeleteSongList)
txRouter.post('/songlist/collectSongList', setCollectSongList)



module.exports = txRouter