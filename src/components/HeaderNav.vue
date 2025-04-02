<template>
  <el-header class="header">
    <div class="nav-container">
      <el-menu mode="horizontal" background-color="#333" text-color="#fff" active-text-color="#ffd04b"
        :default-active="currentRouteName" class="menu">
        <el-menu-item index="main" @click="goToMain">首页</el-menu-item>
        <el-menu-item index="favorites" @click="goToFavorites">收藏</el-menu-item>
        <el-menu-item index="logout" @click="handleLogout" class="logout-button">退出登录</el-menu-item>
      </el-menu>
    </div>
  </el-header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessageBox, ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const store = useStore();

// 获取当前路由名称
const currentRouteName = computed(() => {
  switch (route.name) {
    case 'Main':
      return 'main';
    case 'Favorites':
      return 'favorites';
    default:
      return '';
  }
});

const goToMain = () => {
  router.push({ name: 'Main' });
};

const goToFavorites = () => {
  router.push({ name: 'Favorites' });
};

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.commit('clearUserInfo'); // 清除用户信息
    ElMessage.success('已退出登录');
    router.push('/login'); // 跳转到登录页
  }).catch(() => { });
};
</script>

<style scoped>
.header {
  padding: 0;
}

.nav-container {
  display: flex;
  align-items: center;
  height: 100%;
}

/* 让 el-menu 变成 flex，按钮按 space-between 排列 */
.menu {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

/* 退出按钮颜色 */
.logout-button {
  color: #ff4949 !important;
}
</style>
