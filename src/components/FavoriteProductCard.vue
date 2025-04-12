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
          <el-button type="danger" size="small" @click="cancelFavorite">取消收藏</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { Star } from '@element-plus/icons-vue';
import {  ElMessageBox } from 'element-plus';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['cancelFavorite']);

const cancelFavorite = () => {
  ElMessageBox.confirm('确定要取消收藏该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    props.product.favorite = Math.max((props.product.favorite || 0) - 1, 0);
    emits('cancelFavorite', props.product);
  }).catch(() => { });
};
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
  height: 300px;
  display: flex;
  flex-direction: column;
  width: calc(20% - 16px);
  margin: 0;
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