//app.js
import real from './utils/realtimeLog'
App({
  onLaunch: function () {
    this.globalData = {}
  },
  onError: function (e) {
    real.error(e)
  },
  __TICKET: '',
  __CURRENT_PIC: undefined,
})