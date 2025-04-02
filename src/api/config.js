import axios from 'axios';

// 创建axios实例
const instance = axios.create({
  baseURL: '/api', // 修改为使用代理
  withCredentials: true, // 允许跨域请求携带凭证
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  },
  paramsSerializer: {
    encode: (param) => param // 防止参数被编码
  }
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页面
          localStorage.removeItem('token');
          // router.push('/login');
          break;
        case 403:
          // 权限不足
          console.error('没有权限访问该资源');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        default:
          console.error('服务器错误');
      }
    }
    return Promise.reject(error);
  }
);

export default instance; 