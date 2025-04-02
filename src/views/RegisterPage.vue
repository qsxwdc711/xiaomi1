<template>
  <div class="full-page-background">
    <div class="register-card">
      <h3>用户注册</h3>
      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="80px"
        @submit.prevent="handleRegister">
        <el-form-item label="账号" prop="account">
          <el-input v-model="registerForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">注册</el-button>
          <el-button @click="goToLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { register } from '../api/user';

const router = useRouter();
const registerForm = ref({
  account: '',
  password: '',
  confirmPassword: ''
});
const registerFormRef = ref(null);

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerForm.value.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const registerRules = ref({
  account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }
  ],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
});

const handleRegister = async () => {
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await register({
          userName: registerForm.value.account,
          password: registerForm.value.password
        });

        if (response.code === 200) {
          ElMessage.success('注册成功，请登录');
          router.push('/login');
        } else if (response.code === 400) {
          ElMessage.error('注册失败，用户名已存在');
        } else {
          ElMessage.error('注册失败，请重试');
        }
      } catch (error) {
        ElMessage.error('服务器连接失败，请稍后重试');
      }
    } else {
      ElMessage.error('请填写完整且正确的信息');
      return false;
    }
  });
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* 背景样式 */
.full-page-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/su.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 注册卡片样式 */
.register-card {
  background: rgba(0, 0, 0, 0.6); /* 半透明黑色 */
  border: 2px solid rgba(255, 255, 0, 0.8);
  width: 400px;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(255, 255, 0, 0.8);
  backdrop-filter: blur(15px); /* 轻微模糊效果 */
  transform: translateX(100px);
  animation: slide-in 1s ease-out forwards;
  text-align: center;
  color: white;
}

/* 输入框 */
.register-card input {
  width: 90%;
  padding: 8px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  text-align: center;
}

/* 按钮 */
.register-card button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* 关闭按钮 */
.register-card .close-btn {
  margin-top: 10px;
  background: red;
  color: white;
}

/* 滑入动画 */
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(200px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
