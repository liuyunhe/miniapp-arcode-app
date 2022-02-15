// miniprogram/pages/webview/webview.js
import {HOST, ENV} from './../../config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      productId
    } = options;
    const ticket = getApp().__TICKET;
    this.setData({
      url: `${HOST[ENV + '_WEBVIEW']}/orgmenu/auth?menuCode=arActDraw&productId=${productId}&ticket=${ticket}`
    })
  },
  onWebviewError(e) {
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '页面加载失败，请重试',
      showCancel: false,
      success: res => {
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  }
})