// miniprogram/pages/activity/activity.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pic: null,
    showModal: false,
    showTips: false,
    showTC: false,
    showOfflineEntry: false,
    code: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options);
  },
  initData() {

  },
  showModal() {
    this.setData({
      showModal: true
    })
  },
  showTips() {
    this.setData({
      showTips: true
    })
  },
  onModalClose() {
    this.setData({
      showModal: false
    })
  },
  onTipsClose() {
    this.setData({
      showTips: false
    })
  },
  onTipsCloseTC() {
    this.setData({
      showTC: false
    })
  },
  onActClick() {
    if (app.__HAS_ONE_STAGE_DRAW_CHANCE) {
      // 一阶段抽奖
      wx.navigateTo({
        url: '/pages/webview/webview?type=1',
      })
    } else {
      this.setData({
        showTC: true
      })
    }
  },
  onJX() {
    wx.navigateTo({
      url: '/pages/webview/webview?type=2',
    })
  },
  onQX() {
    this.onTipsCloseTC()
    wx.reLaunch({
      url: '/pages/tips/tips'
    })
  }
});