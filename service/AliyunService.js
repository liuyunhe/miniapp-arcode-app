import {
  post
} from "./request";

import {
  ALIYUN_IMAGE_VERIFY
} from "./Api";

export function verifyImage(image) {
  return post(ALIYUN_IMAGE_VERIFY, {
    data: {
      image
    }
  })
}