import request from './config';

// 用户登录
export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      userName: data.userName,
      password: data.password
    }
  });
};

// 用户注册
export const register = (data) => {
  return request({
    url: '/user/register',
    method: 'post',
    data: {
      userName: data.userName,
      password: data.password
    }
  });
};

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/api/user/info',
    method: 'get'
  });
};

// 更新用户信息
export const updateUserInfo = (data) => {
  return request({
    url: '/api/user/info',
    method: 'put',
    data
  });
}; 