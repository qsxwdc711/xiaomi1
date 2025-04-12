import request from './config';


// 获取商品列表
export const getProducts = (params) => {
  return request({
    url: '/product/get',
    method: 'get',
    params: {
      minPrice: params.minPrice || null,
      maxPrice: params.maxPrice || null,
      keyword: params.keyword || null,
      sortOrder: params.sortOrder || null,
      category: params.category || null,
      page: params.page || 0,
      size: params.size || 10
    },
    paramsSerializer: {
      encode: (param) => param // 防止参数被编码
    }
  });
};

// 获取所有分类
export const getCategories = () => {
  return request({
    url: '/category/get',
    method: 'get'
  });
};

// 添加商品
export const addProduct = (data) => {
  return request({
    url: '/product/add',
    method: 'post',
    data: {
      img: data.img,
      name: data.name,
      price: data.price,
      count: data.count,
      favorite: data.favorite,
      category: data.category
    }
  });
};

// 添加分类
export const addCategory = (data) => {
  return request({
    url: '/category/add',
    method: 'post',
    data: {
      name: data.name
    }
  });
};

// 删除商品
export const deleteProduct = (id) => {
  return request({
    url: 'product/delete',
    method: 'get',
    params: {
      id: id
    }
  });
};

// 删除分类
export const deleteCategory = (id) => {
  return request({
    url: '/category/delete',
    method: 'get',
    params: {
      id: id
    }
  });
};

export const updateProduct = (product) => {
  console.log('更新商品请求数据:', product);
  return request({
    url: '/product/update',
    method: 'post',
    data: product
  });
};

// 收藏商品
export const favoriteProduct = (userId, productId) => {
  return request({
    url: '/product/favorite',
    method: 'get',
    params: {
      user_id: userId,
      product_id: productId
    }
  });
};

// 获取用户收藏列表
export const getFavoriteProducts = (userId, page, size) => {
  return request({
    url: '/favorite/get',
    method: 'get',
    params: {
      user_id: userId,
      page,
      size
    },
    paramsSerializer: {
      encode: (param) => param // 防止参数被编码
    }
  });
};

// 取消收藏
export const cancelFavorite = (favoriteId) => {
  return request({
    url: '/favorite/delete',
    method: 'get',
    params: {
      id: favoriteId
    }
  });
}; 