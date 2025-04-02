import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3003'; 

// ����������
axios.interceptors.request.use(
  config => {
    // �ڷ�������֮ǰ��Щʲô
    console.log('����ʼ:', config);
    // �����������������ͷ���������������
    return config;
  },
  error => {
    // �����������Щʲô
    console.error('�������:', error);
    return Promise.reject(error);
  }
);

// ��Ӧ������
axios.interceptors.response.use(
  response => {
    // ����Ӧ������Щʲô
    console.log('��Ӧ�ɹ�:', response);
    return response;
  },
  error => {
    // ����Ӧ������Щʲô
    console.error('��Ӧ����:', error);
    return Promise.reject(error);
  }
);

// ԭ�����д����ظ������ get �������������¶���һ�����ϵ� get ����
const get = async ({
  keyword = '', // ģ����ѯ�ؼ���
  minPrice = null, // ��ͼ۸�
  maxPrice = null, // ��߼۸�
  sort = '', // �۸�����ʽ��'asc' ����'desc' ����
  category = '', // �����ѯ
  page = 1, // ��ǰҳ��
  pageSize = 10 // ÿҳ��ʾ����
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
    console.error('��ȡ��Ʒ���ݳ���:', error);
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