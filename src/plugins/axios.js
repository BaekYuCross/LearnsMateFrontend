import axios from 'axios';
import { camelCase } from 'lodash';

const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: toCamelCase(obj[key])
      }),
      {}
    );
  }
  return obj;
};


// 별도 인스턴스 생성
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(response => {
 // Excel 파일인 경우 변환하지 않고 그대로 반환
 if (response.headers['content-type']?.includes('spreadsheetml.sheet')) {
   return response;
 }
 
 // 나머지 응답만 camelCase 변환
 response.data = toCamelCase(response.data);
 return response;
}, error => {
 return Promise.reject(error);
});

export default axiosInstance;