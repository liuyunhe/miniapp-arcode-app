// miniprogram/pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function () {
    wx.setStorageSync("noFirst", '1')
  },

  onTabClick() {
    wx.reLaunch({
      url: '/pages/scan/scan',
    })
  }
})