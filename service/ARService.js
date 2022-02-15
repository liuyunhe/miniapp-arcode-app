import {
  AR_CODE_CHECK,
  AR_IMAGE_SEARCH,
  AR_OFFLINE_CHANGCE_QUERY
} from './Api'
import {
  get,
  post
} from './request'


export function arCodeCheck(data = {
  code: '',
  lon: 0,
  lat: 0
}) {
  return post(AR_CODE_CHECK, {
    data
  })
}
export function arImageSearch(img, ticket) {
  return post(AR_IMAGE_SEARCH + '?ticket=' + ticket, {
    data: {
      img
    }
  })
}
export function arOfflineChangceQuery(ticket) {
  return post(AR_OFFLINE_CHANGCE_QUERY, {
    data: {
      ticket
    }
  })
}