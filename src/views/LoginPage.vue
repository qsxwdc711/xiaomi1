<template>
  <div class="container">
    <!-- 背景视频 -->
    <video autoplay loop muted playsinline class="background-video">
      <source src="E:\xiaomi1\src\assets\su77.mp4" type="video/mp4" />
    </video>

    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="logo">Xiaomi商城</div>
      <div class="nav-links">
        <template v-if="!isLoggedIn">
          <button @click="openAuthDialog(true)">登录</button>
          <button @click="openAuthDialog(false)">注册</button>
        </template>
        <template v-else>
          <span class="welcome-text">欢迎, {{ userName }}</span>
          <button @click="handleLogout">退出</button>
        </template>
      </div>
    </nav>

    <!-- 登录/注册 对话框 -->
    <el-dialog v-model="showLogin" :title="isLogin ? '登录' : '注册'" width="350px" center>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item v-if="!isLogin" label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAuth">{{ isLogin ? '登录' : '注册' }}</el-button>
          <el-button @click="showLogin = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { login, register } from '../api/user';

const router = useRouter();
const store = useStore();
const showLogin = ref(false);
const isLogin = ref(true);
const formRef = ref(null);
const formData = ref({
  username: '',
  password: '',
  confirmPassword: ''
});

// 表单验证规则
const rules = {
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== formData.value.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      }, 
      trigger: 'blur'
    }
  ]
};

// 计算属性，从 Vuex 获取用户信息
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const userName = computed(() => store.getters.getUserName);

const openAuthDialog = (loginMode) => {
  isLogin.value = loginMode;
  showLogin.value = true;
};

const handleAuth = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    try {
      const apiCall = isLogin.value ? login : register;
      const response = await apiCall({
        userName: formData.value.username,
        password: formData.value.password
      });

      if (response.code === 200) {
        ElMessage.success(isLogin.value ? '登录成功' : '注册成功');

        if (isLogin.value) {
          // 存储用户信息到 Vuex 和 localStorage
          store.commit('setUserInfo', {
            id: response.data.id,
            userName: response.data.userName
          });

          router.push('/main'); // 跳转到主页
        } else {
          isLogin.value = true; // 切换回登录模式
        }
        showLogin.value = false;
      } else {
        ElMessage.error(response.message || '操作失败');
      }
    } catch (error) {
      ElMessage.error('服务器连接失败，请稍后重试');
    }
  });
};

// 退出登录
const handleLogout = () => {
  store.commit('clearUserInfo');
  router.push('/login');
};
</script>

<style scoped>
/* 让页面充满整个视口 */
html, body, .container {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 背景视频 */
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
}

/* 顶部导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  z-index: 1000;
  box-sizing: border-box;
}

/* LOGO */
.logo {
  font-size: 24px;
  font-weight: bold;
}

/* 导航栏按钮 */
.nav-links button {
  margin-left: 15px;
  padding: 8px 15px;
  background: none;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  transition: 0.3s;
  font-size: 16px;
}

.nav-links button:hover {
  background: white;
  color: black;
}

/* 欢迎信息 */
.welcome-text {
  margin-right: 15px;
  font-size: 16px;
}
</style>
