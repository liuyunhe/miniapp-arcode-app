// miniprogram/pages/result/result.js
import data from './data'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data,
    current: 'shijiazhuang'
  },

  onTabClick(e) {
    const {
      currentTarget
    } = e;
    const {
      dataset
    } = currentTarget;

    this.setData({
      current: dataset.current
    })
  }
})