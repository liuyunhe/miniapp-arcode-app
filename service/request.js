import {
  ENV,
  HOST
} from './../config';
const {
  request
} = wx;

const processUrl = url => {
  return /^https?:\/\//.testurl ? url : HOST[ENV] + url;
}
const _req = (method, url, configs = {}) => {
  url = processUrl(url);
  return new Promise((resolve, reject) => {
    const data = configs.data;
    const header = configs.headers || {};
    header['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    console.log('request=>', url, data);
    request({
      url,
      method,
      data,
      header,
      success: res => {
        const {
          statusCode,
          data
        } = res;
        if (statusCode === 200) {
          return resolve(data);
        }
        reject(data);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}

export function get(url, configs) {
  return _req('GET', url, configs);
}
export function post(url, configs) {
  return _req('POST', url, configs);
}