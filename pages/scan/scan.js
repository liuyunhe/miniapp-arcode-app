// miniprogram/pages/scan/scan.js

import {
  arCodeCheck
} from './../../service/index'
import {
  AR_IMAGE_SEARCH
} from './../../service/Api'
import {
  HOST,
  ENV
} from './../../config'
import real from './../../utils/realtimeLog'
const app = getApp();
// 节流
var throttle = function (func, delay) {
  var prev = Date.now();
  return function () {
    var context = this;
    var args = arguments;
    var now = Date.now();
    if (now - prev >= delay) {
      func.apply(context, args);
      prev = Date.now();
    }
  }
}
let listener;
let ctx;
const imageThreshold = 10;
let isChecking = false;
let isCameraError = false;
const darkThreshold = 15;
let scanTimes = 0;
let imgError = 0;
let scanThreshold = 3000;
const scanRetryTimes = 2;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showGuide: false,
    tipsTop: 0,
    isDark: false,
    lightStatus: 'off',
    tips: ['请将烟盒正面对准相机，可提高识别速度', '光线暗，请打开闪光灯'],
    tipsIndex: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.disposeCamera();
    this.calcTipsTop();   // 计算屏幕宽高
    this.init();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.initCamera();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.disposeCamera();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.disposeCamera();
  },
  /**
   * 拒绝授权相机，让用户打开设置去开启相机
   * 1、开启成功，重载小程序
   * 2、开启失败或者没开启，返回界面之后继续弹框提示
   */
  onCameraError(e) {
    if (isCameraError) return;
    wx.getSetting({
      success: res => {
        real.info('相机初始化异常，检测授权信息...');
        // 有"scope.camera"参数，说明拒绝了授权，没有则说明是第一次，还没有授权过
        if (res.authSetting.hasOwnProperty("scope.camera")) {
          real.info('相机授权异常，用户拒绝过授权', res);
          askForCamera.call(this);
        }
      }
    })

    function askForCamera() {
      isCameraError = true;
      real.info('请求开启相机授权...');
      wx.showModal({
        title: '提示',
        content: '需要开启摄像头才能参加活动',
        showCancel: false,
        success: res => {
          wx.openSetting({
            success: res => {
              isCameraError = false;
              const {
                authSetting
              } = res;
              if (authSetting["scope.camera"]) {
                real.info('用户打开了相机授权...');
                return wx.reLaunch({
                  url: '/pages/scan/scan',
                })
              }
              real.info('用户拒绝了开启授权...');
              this.init();
            }
          })
        }
      })
    }

  },
  // 相机授权成功
  onCameraDone() {
    this.init();
  },
  onLightClick() {
    let {
      lightStatus
    } = this.data;
    lightStatus = lightStatus === 'off' ? 'on' : 'off';
    this.setData({
      lightStatus
    })
  },
  // 计算屏幕宽高
  calcTipsTop() {
    const {
      screenHeight
    } = wx.getSystemInfoSync();
    const gifHeight = 683;
    const threshold = screenHeight <= 568 ? 140 : 40;
    const tipsTop = (screenHeight) + (gifHeight / 2 + threshold);
    this.setData({
      tipsTop
    })
  },
  disposeCamera() {
    ctx = undefined;
    listener = undefined;
  },
  init() {
    real.info('初始化开始...');
    // wx.hideToast();
    wx.showToast({
      title: '正在初始化，请稍后...',
      icon: 'none',
      duration: 60 * 1000
    })
    // 初始化之前判断是否开启了相机，没开启的话，手动调用一下onCameraError方法
    wx.getSetting({
      success: res => {
        const {
          authSetting
        } = res;
        real.info('获取授权信息，检查摄像头状态...');
        if (authSetting["scope.camera"]) {
          real.info('摄像头开启正常...');
          real.info('初始化摄像头开始...');
          this.initCamera();
          wx.hideToast();
          this.setData({
            showGuide: true
          })
        } else {
          real.info('没有授权相机');
          wx.hideToast()
          this.onCameraError();
        }
      }
    })

  },
  initError() {
    wx.showModal({
      title: '提示',
      content: '初始化失败，请重试',
      showCancel: false,
      success: res => {
        wx.reLaunch({
          url: '/pages/scan/scan',
        })
      }
    })
  },
  // 获取后台ticket
  getTicket() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          // 获取code
          const {
            code
          } = res
          let retryTime = 0;
          getLocation();
          real.info('获取code成功:', code);
          function getLocation() {
            wx.getLocation({
              type: 'wgs84',
              success: res => {
                real.info('允许授权位置信息...', res);
                const {
                  longitude: lon,
                  latitude: lat
                } = res;
                arCodeCheck({
                  code,
                  lon,
                  lat
                }).then(resolve).catch(reject);
              },
              fail: e => {
                real.error('拒绝授权位置信息:', e);
                if (/calcel|deny/g.test(e.errMsg) && retryTime == 0) {
                  retryTime++;
                  wx.showModal({
                    title: '提醒',
                    content: '授权位置信息，才能参与活动抽奖，是否去授权？',
                    success: res => {
                      if (res.confirm) {
                        real.info('拒绝授权位置信息，允许重试', res);
                        // 确定重试，打开设置
                        return wx.openSetting({
                          withSubscriptions: true,
                          success: res => {
                            // const {authSetting} = res;
                            // if(authSetting["scope.userLocation"]) {
                            //   return getLocation();
                            // }
                            getLocation();
                          },
                          fail: e => {
                            console.log('setting fail', e);
                            getLocation();
                          }
                        })
                      }
                      real.info('拒绝授权位置信息，不允许重试');
                      arCodeCheck({
                        code
                      }).then(resolve).catch(reject)
                    }
                  })
                } else {
                  arCodeCheck({
                    code
                  }).then(resolve).catch(reject)
                }
              }
            })
          }

        },
        // 登录失败，低概率事件，说明网络可能不好，重新载入一下程序
        fail: e => {
          real.error('登录失败', e);
          reject(e)
        }
      })
    })

  },
  // 初始化相机
  initCamera() {
    real.info('初始化相机开始...');
    if (listener) {
      console.log(listener)
      listener.stop();
    }
    ctx = ctx || wx.createCameraContext();
    listener = listener || ctx.onCameraFrame(throttle(this.onFrame, scanThreshold).bind(this));
    listener.start();

  },
  // 视频关键帧监听
  onFrame(frame) {
    real.info('关键帧监听成功...');
    scanTimes++;
    if (isChecking) return;
    isChecking = true;
    let temp;
    this.bufferToBase64(frame)
      .then(res => {
        real.info('关键帧转图片成功');
        const path = res;
        // temp = res.data;
        const token = wx.getStorageSync('token')
        return wx.uploadFile({
          filePath: path,
          name: 'img',
          header: {
            token
          },
          url: `${HOST[ENV]}${AR_IMAGE_SEARCH}`,
          success: res => {
            const result = JSON.parse(res.data);
            const {
              code,
              msg,
              data
            } = result;
            if (code == 200) {
              real.info('图片上传成功', result);
              /**
               * [
               * {
               *  categoryId:number,
               *  customContent: string,
               *  picName: string,
               *  productId: string,
               *  sortExprValues: string;
               * }
               * ]
               */
              // const pic = data && data.auctions || [];
              const targetPic = data.searchResult || {}
              const val = targetPic && targetPic.sortExprValues || '';
              const sortExpr = Number(val.split(';')[0] || '0');
              const isFail = sortExpr < imageThreshold || !sortExpr;
              if (isFail) {
                real.error('图片识别失败, 第' + scanTimes + '次', targetPic);
                isChecking = false;
                // wx.showToast({
                //   title: '成功失败:' + targetPic.sortExprValues,
                //   icon: 'none'
                // })
                if (scanTimes >= scanRetryTimes) {
                  real.error('图片识别失败, 超过自动识别次数');
                  // 停止扫描，询问一下重试
                  scanTimes = 0;
                  listener.stop();
                  wx.showModal({
                    showCancel: false,
                    title: '提示',
                    content: '识别失败，请将产品开盖后对准相机!',
                    confirmText: '重新识别',
                    success: res => {
                      wx.reLaunch({
                        url: '/pages/scan/scan',
                      })
                    }
                  });
                  return;
                }
                return;
                // return this.initCamera();
              }
              // 识别成功，停止监听关键帧
              real.info('识别成功');
              listener.stop();
              isChecking = false;
              app.__POSTER = data.poster
              this.playBgm().then(res => {
                app.__CURRENT_PIC = targetPic;
                wx.redirectTo({
                  url: `/pages/activity/activity`
                })
              })
            } else {
              // this.initCamera();
              real.error('ar接口请求失败', result);
              isChecking = false;
              wx.showModal({
                title: '提示',
                content: msg,
                showCancel: false,
                success: (res) => {
                  if (msg.includes('结束')) {
                    wx.reLaunch({
                      url: '/pages/tips/tips',
                    })
                  } else {
                    wx.reLaunch({
                      url: '/pages/scan/scan',
                    })
                  }
                }
              })
              listener.stop();
              console.error(res)
            }
          },
          fail: e => {
            real.error('关键帧转图片失败', e);
            // this.initCamera()
            isChecking = false;
            console.log('up f', e)
          }
        })
      })
      .catch(e => {
        // this.initCamera();
        real.error('图片转换失败', e);
        isChecking = false;
        console.error('图片转换失败=>', e)
        imgError += 1
        if (imgError == 5) {
          listener.stop();
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '识别失败，请将产品开盖后对准相机!',
            confirmText: '重新识别',
            success: res => {
              wx.reLaunch({
                url: '/pages/scan/scan',
              })
            }
          });
        }
      })
    // listener.stop();
  },
  // 扫码成功播放bgm
  playBgm() {
    return new Promise((resolve, reject) => {
      const bgManager = wx.createInnerAudioContext();
      bgManager.src = '/audio/scan.mp3';
      bgManager.play();
      bgManager.onEnded(e => {
        resolve();
      })
    })
  },
  // 本地缓存文件转base64
  tempFileToBase64(path) {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath: path, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: resolve,
        fail: reject
      })
    })
  },
  checkLight(data) {
    if (!data || !data.length) return;
    const len = data.length;
    const [sr, sg, sb] = data;
    const er = data[len - 4]
    const eg = data[len - 3]
    const eb = data[len - 2]
    const isDark = [sr, sg, sb, er, eg, eb].every(item => item <= darkThreshold);
    this.setData({
      isDark,
      tipsIndex: isDark ? 1 : 0
    })
  },
  // arraybuffer转base64
  bufferToBase64(frame, quality = 1) {
    real.info('buffer数据转换开始...');
    var data = new Uint8Array(frame.data);
    var clamped = new Uint8ClampedArray(data);
    this.checkLight(data);
    return new Promise((resolve, reject) => {
      // 实时帧数据添加到Canvas上
      wx.canvasPutImageData({
        canvasId: 'myCanvas',
        x: 0,
        y: 0,
        width: frame.width,
        height: frame.height,
        data: clamped,
        success: (res) => {
          // 转换临时文件
          real.info('buffer转图片成功');
          real.info('图片生成开始...');
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: frame.width,
            height: frame.height,
            canvasId: 'myCanvas',
            fileType: 'jpg',
            destWidth: frame.width,
            destHeight: frame.height,
            // 精度修改
            quality,
            success: (res) => {
              real.info('图片生成成功...');
              const path = res.tempFilePath;
              return resolve(path)
              // 临时文件转base64
              this.tempFileToBase64(path)
                .then(resolve)
                .catch(reject)
            },
            fail: reject
          }, this)
        },
        fail: e => {
          real.error('buffer转换失败...', e);
        }
      })
    })

  },
})