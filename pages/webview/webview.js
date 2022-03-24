// miniprogram/pages/webview/webview.js
import { HOST, ENV } from './../../config'
const app = getApp();


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
    const { type } = options
    console.log(type)
    if (type == 2) {
      let url = `${HOST[ENV + '_WEBVIEW']}/orgmenu/auth?menuCode=hyrArUpload`
      if (app.__RID) {
        url += `&rid=${app.__RID}`
      }
      this.setData({
        url
      })
    }
    else if (type == 3) {
      let url = `${HOST[ENV + '_WEBVIEW']}/orgmenu/auth?menuCode=hyrArUpload`
      this.setData({
        url
      })
    } else {
      let url = `${HOST[ENV + '_WEBVIEW']}/orgmenu/menuIncome?menuCode=hyrArFirst`
      if (app.__RID) {
        url += `&rid=${app.__RID}`
      }
      this.setData({
        url
      })
    }
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