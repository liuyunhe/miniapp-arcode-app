import {
  AR_CODE_CHECK,
  AR_OFFLINE_CHANGCE_QUERY,
  AR_TOKEN
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

export function arOfflineChangceQuery(ticket) {
  return post(AR_OFFLINE_CHANGCE_QUERY, {
    data: {
      ticket
    }
  })
}
export function getToken(code) {
  return post(AR_TOKEN, {
    data: {
      code
    }
  })
}