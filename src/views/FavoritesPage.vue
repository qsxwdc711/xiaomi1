<template>
  <div class="favorites-container">
    <HeaderNav />
    <h1 class="page-title">我的收藏</h1>
    <el-main class="product-list" v-loading="loading">
      <template v-if="favoriteProducts.length > 0">
        <FavoriteProductCard v-for="product in favoriteProducts" :key="product.id" :product="product"
          @cancelFavorite="handleCancelFavorite" />
      </template>
      <el-empty v-else description="暂无收藏商品" />
    </el-main>
    <el-pagination v-if="total > 0" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total" class="pagination" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import HeaderNav from '../components/HeaderNav.vue';
import FavoriteProductCard from '../components/FavoriteProductCard.vue';
import { getFavoriteProducts, cancelFavorite } from '../api/product';

const store = useStore();
const loading = ref(false);

// 分页相关
const currentPage = ref(1); // 页面显示从1开始
const pageSize = ref(10); // 修改默认每页显示数量为10
const total = ref(0);
const favoriteProducts = ref([]);

// 获取收藏列表
const fetchFavoriteProducts = async () => {
  const userId = store.state.userId;
  if (!userId) {
    ElMessage.warning('请先登录');
    return;
  }

  loading.value = true;
  try {
    // 发送请求时页码减1，因为后端从0开始
    const response = await getFavoriteProducts(userId, currentPage.value - 1, pageSize.value);
    console.log('发送的分页参数:', { page: currentPage.value - 1, size: pageSize.value });
    console.log('收藏列表响应:', response);

    if (response.code === 200 && response.data) {
      // 确保每次都重置数组
      favoriteProducts.value = [];
      // 检查返回的数据是否符合预期
      if (Array.isArray(response.data.pageList)) {
        favoriteProducts.value = response.data.pageList;
      }
      total.value = response.data.totalCount || 0;

      // 如果当前页没有数据且不是第一页，回到上一页
      if (favoriteProducts.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
        await fetchFavoriteProducts();
        return;
      }

      // 如果返回的数据超过每页限制，只显示pageSize数量的数据
      if (favoriteProducts.value.length > pageSize.value) {
        favoriteProducts.value = favoriteProducts.value.slice(0, pageSize.value);
      }

      console.log('处理后的收藏列表:', favoriteProducts.value);
      console.log('每页显示数量:', pageSize.value);
      console.log('当前页商品数量:', favoriteProducts.value.length);
      console.log('总数量:', total.value);
    } else {
      ElMessage.error(response.message || '获取收藏列表失败');
    }
  } catch (error) {
    console.error('获取收藏列表错误:', error);
    ElMessage.error('获取收藏列表失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 监听分页参数变化
watch([currentPage, pageSize], () => {
  fetchFavoriteProducts();
});

// 分页处理
const handleSizeChange = async (size) => {
  pageSize.value = size;
  currentPage.value = 1; // 切换每页数量时重置为第一页
  await fetchFavoriteProducts();
};

const handleCurrentChange = async (page) => {
  currentPage.value = page;
  await fetchFavoriteProducts();
};

// 取消收藏
const handleCancelFavorite = async (product) => {
  try {
    if (!product.id) {
      ElMessage.error('收藏记录ID不存在');
      return;
    }

    console.log('取消收藏请求参数:', { id: product.id });
    const response = await cancelFavorite(product.id);
    console.log('取消收藏响应:', response);
    
    if (response.code === 200) {
      ElMessage.success('已取消收藏');
      
      // 如果当前页只有一个商品，且不是第一页，则跳转到上一页
      if (favoriteProducts.value.length === 1 && currentPage.value > 1) {
        currentPage.value--;
        await fetchFavoriteProducts(); // 获取上一页数据
      } else {
        // 重新获取当前页数据
        await fetchFavoriteProducts();
      }

      // 触发父组件的刷新方法，更新主页的收藏状态
      emit('refresh');
    } else {
      console.error('取消收藏失败:', response);
      ElMessage.error(response.message || '取消收藏失败');
    }
  } catch (error) {
    console.error('取消收藏错误:', error);
    ElMessage.error('取消收藏失败，请稍后重试');
  }
};

// 定义emit
const emit = defineEmits(['refresh']);

// 页面加载时获取收藏列表
onMounted(() => {
  fetchFavoriteProducts();
});
</script>

<style scoped>
.favorites-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin: 20px 0;
  color: #303133;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  padding: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .product-list {
    justify-content: center;
  }
}
</style>
