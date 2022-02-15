const { arOfflineChangceQuery } = require("../../service/ARService");

// miniprogram/pages/activity/activity.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pic: null,
    productId: 0,
    colors: {
      1001: "#fff9ee",
      1002: "#fff0db",
      1003: "#d7f3ef",
      1004: "#2c8640",
    },
    showModal: false,
    showOfflineEntry: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options);
    this.queryOfflineChangce();
  },
  initData(options) {
    let {
      productId
    } = options;
    if (!productId) productId = 1001
    if (!productId) {
      return wx.reLaunch({
        url: "/pages/scan/scan",
      });
    }
    this.setData({
      productId
    });
  },
  onTips1Click() {
    wx.navigateTo({
      url: '/pages/result/result',
    })
  },
  showModal() {
    this.setData({
      showModal: true
    })
  },
  onModalClose() {
    this.setData({
      showModal: false
    })
  },
  queryOfflineChangce() {
    const ticket = app.__TICKET;
    arOfflineChangceQuery(ticket).then(res => {
      console.log(res)
      const { data } = res;
      this.setData({ showOfflineEntry: data.hasChance })
    })
  },
  onActClick() {
    const {
      productId
    } = this.data;
    wx.navigateTo({
      url: '/pages/webview/webview?productId=' + productId,
    })
  },
});