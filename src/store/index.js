import { createStore } from 'vuex';

const store = createStore({
  state: {
    favorites: [],
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
    userId: localStorage.getItem('userId') || null,
    userName: localStorage.getItem('userName') || ''
  },
  mutations: {
    toggleFavorite(state, product) {
      const index = state.favorites.findIndex(fav => fav.id === product.id);
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(product);
      }
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      state.userId = userInfo.id;
      state.userName = userInfo.userName;
      // ±£´æµ½ localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('userId', userInfo.id);
      localStorage.setItem('userName', userInfo.userName);
    },
    clearUserInfo(state) {
      state.userInfo = null;
      state.userId = null;
      state.userName = '';
      // Çå³ý localStorage
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
    }
  },
  getters: {
    isLoggedIn: state => !!state.userId,
    getUserInfo: state => state.userInfo,
    getUserId: state => state.userId,
    getUserName: state => state.userName
  }
});

export default store;