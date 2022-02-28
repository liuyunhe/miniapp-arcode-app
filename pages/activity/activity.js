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
    showOfflineEntry: false,
    code: '',
    posterUrl: 'https://qrmkt.oss-cn-beijing.aliyuncs.com/common/memberDay/upload/poster.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options);
  },
  initData() {
    if (app.__POSTER) {
      this.setData({
        'posterUrl': app.__POSTER
      })
      this.setData({
        showModal: true
      })
    }
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
  onActClick() {
    wx.navigateTo({
      url: '/pages/webview/webview',
    })
  },
});