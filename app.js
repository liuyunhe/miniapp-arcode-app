//app.js
import real from './utils/realtimeLog'
import {
  getToken
} from './service/index'

App({
  onLaunch: function () {
    this.globalData = {}
    wx.login({
      success: res => {
        // 获取code
        const {
          code
        } = res
        getToken(code).then(res => {
          const { token } = res.data
          wx.setStorage({
            key: "token",
            data: token,
          })
        })
      }
    })
    let noFirst = wx.getStorageSync('noFirst')
    if (noFirst !== '1') {
      wx.navigateTo({
        url: "pages/tips/tips"
      })
    }
  },
  onError: function (e) {
    real.error(e)
  },
  __TICKET: '',
  __POSTER: '',
  __CURRENT_PIC: undefined,
})