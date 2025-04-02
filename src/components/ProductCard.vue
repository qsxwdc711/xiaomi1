<template>
  <div class="product-card">
    <div class="image-container">
      <img :src="product.img" alt="Product" class="product-image">
      <div class="favorite-count">
        <el-icon>
          <Star />
        </el-icon>
        <span>被{{ product.favorite }}人收藏</span>
      </div>
    </div>

    <div class="content">
      <p class="product-name">{{ product.name }}</p>
      <p class="product-category">产品种类：{{ product.category }}</p>
      <div class="meta">
        <span class="product-price">¥{{ product.price }}</span>
        <div class="buttons">
          <el-button type="primary" size="small" @click="addToCart(product)">收藏</el-button>
          <el-button type="warning" size="small" @click.stop="$emit('edit', product)">修改</el-button>
          <el-button type="danger" size="small" @click.stop="$emit('remove', product.id)">下架</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { Star } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { favoriteProduct } from '../api/product';
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
});

// 定义 edit 事件
const emits = defineEmits(['addToCart', 'toggleFavorite', 'remove', 'edit']);

const addToCart = async (product) => {
  try {
    const userId = store.state.userId; // 从Vuex获取用户ID
    if (!userId) {
      ElMessage.warning('请先登录');
      return;
    }

    console.log('收藏请求参数:', { userId, productId: product.id });
    const response = await favoriteProduct(userId, product.id);
    
    if (response.code === 200) {
      ElMessage.success('收藏成功');
      product.favorite = (product.favorite || 0) + 1;
      emits('addToCart', product);
    } else {
      ElMessage.error(response.message || '收藏失败');
    }
  } catch (error) {
    console.error('收藏请求错误:', error);
    ElMessage.error('收藏失败，请稍后重试');
  }
};

const toggleFavorite = (product) => {
  emits('toggleFavorite', product);
};
</script>

<style scoped>
.product-card {
  width: 220px; /* 固定宽度 */
  height: 300px; /* 固定高度 */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
}


.image-container {
  position: relative;
  height: 200px;
  width: 100%;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.favorite-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.favorite-count .el-icon {
  color: #ffd04b;
}

.content {
  padding: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  line-clamp: 2;
  font-size: 14px;
  line-height: 1.3;
  margin-bottom: 4px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-category {
  font-size: 12px;
  color: #909399;
  margin: 4px 0;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.product-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 600;
}

.buttons {
  display: flex;
  gap: 4px;
}

.el-button {
  padding: 6px 8px;
  font-size: 12px;
}

@media (max-width: 1200px) {
  .product-card {
    width: calc(33.333% - 15px);
  }
}

@media (max-width: 768px) {
  .product-card {
    width: calc(50% - 15px);
  }
}

@media (max-width: 480px) {
  .product-card {
    width: calc(100% - 15px);
  }
}
</style>