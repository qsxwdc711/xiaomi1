<template>
  <div id="app">
    <!-- <nav>
      <router-link to="/login">登录</router-link>
      <router-link to="/register">注册</router-link>
    </nav> -->
    <router-view></router-view>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
nav {
  margin-bottom: 20px;
}

router-link {
  margin-right: 10px;
  text-decoration: none;
  color: #007bff;
}

router-link:hover {
  text-decoration: underline;
}
</style>