import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3003'; 

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    console.log('请求开始:', config);
    // 可以在这里添加请求头、处理请求参数等
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    console.log('响应成功:', response);
    return response;
  },
  error => {
    // 对响应错误做些什么
    console.error('响应错误:', error);
    return Promise.reject(error);
  }
);

// 原代码中存在重复定义的 get 方法，下面重新定义一个整合的 get 方法
const get = async ({
  keyword = '', // 模糊查询关键字
  minPrice = null, // 最低价格
  maxPrice = null, // 最高价格
  sort = '', // 价格排序方式，'asc' 升序，'desc' 降序
  category = '', // 分类查询
  page = 1, // 当前页码
  pageSize = 10 // 每页显示数量
}) => {
  const params = {
    keyword,
    minPrice,
    maxPrice,
    sort,
    category,
    page,
    pageSize
  };

  try {
    const response = await axios.get('/api/get', { params });
    return response;
  } catch (error) {
    console.error('获取商品数据出错:', error);
    throw error;
  }
};
const register = (req) => {
  return axios.post('/api/register', req);
};

const login = (req) => {
  return axios.post('/api/login', req);
};

const productAdd = (req) => {
  return axios.post(`/api/product_add`, req);
};

const productUpdate = (req) => {
  return axios.post(`/api/product_update`, req);
};

const productDelete = (id) => {
  return axios.delete(`/api/product_delete/${id}`);
};

export {
  register,
  login,
  get,
  productAdd,
  productUpdate,
  productDelete
};