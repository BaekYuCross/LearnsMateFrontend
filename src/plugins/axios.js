import axios from 'axios';
import { camelCase } from 'lodash';

const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
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
  response.data = toCamelCase(response.data);
  return response;
});

// 별도 인스턴스 export
export default axiosInstance;