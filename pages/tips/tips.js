import {
  postDrawChance
} from './../../service/index'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTips: false,
  },

  onLoad: function () {
    console.log(app)
  },
  showTips() {
    this.setData({
      showTips: true
    })
  },
  onTipsClose() {
    this.setData({
      showTips: false
    })
  },
  onTabClick() {
    wx.reLaunch({
      url: '/pages/scan/scan',
    })
  },
  onTabClick2() {
    postDrawChance().then(res => {
      if (res.code === '200') {
        // flag=1没有海报或者海报已经使用  flag=2可以上传凭证抽奖. flag=3本期活动抽奖已用完. flag=4本周活动已结束，请下周再来
        if (res.data.flag == 1) {
          wx.showModal({
            title: '提示',
            content: '您现在还没有获取海报或海报已消耗，您可以再次通过AR识别规格来获取海报，然后将宣传截图进行上传哦！',
            showCancel: false,
            success: res => {

            }
          })
        } else if (res.data.flag == 2) {
          wx.navigateTo({
            url: '/pages/webview/webview?type=3',
          })
        } else if (res.data.flag == 3) {
          wx.showModal({
            title: '提示',
            content: '您本期上传凭证抽奖次数已用完！',
            showCancel: false,
            success: res => {

            }
          })
        } else if (res.data.flag == 4) {
          wx.showModal({
            title: '提示',
            content: '本周活动已结束，请下周再来!',
            showCancel: false,
            success: res => {

            }
          })
        }
      }
    })
  }
})