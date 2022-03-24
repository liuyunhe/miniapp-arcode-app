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
  },
  onError: function (e) {
    real.error(e)
  },
  __TICKET: '',
  __HAS_ONE_STAGE_DRAW_CHANCE: false,
  __RID: '',
  __CURRENT_PIC: undefined,
})