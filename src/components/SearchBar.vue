<template>
  <div class="search-container">
    <div class="search-bar">
      <div class="search-group">
        <el-input v-model="searchQuery" placeholder="搜索商品名称" @keyup.enter="handleSearch" clearable
          :prefix-icon="Search" />
      </div>

      <div class="price-group">
        <el-input v-model="minPrice" placeholder="最低价格" type="number" @keyup.enter="handleSearch">
          <template #prefix>¥</template>
        </el-input>
        <span class="price-separator">-</span>
        <el-input v-model="maxPrice" placeholder="最高价格" type="number" @keyup.enter="handleSearch">
          <template #prefix>¥</template>
        </el-input>
      </div>

      <div class="filter-group">
        <el-select v-model="category" placeholder="选择分类" @change="handleSearch">
          <el-option label="全部" value=""></el-option>
          <el-option label="笔记本" value="笔记本"></el-option>
          <el-option label="手机" value="手机"></el-option>
          <el-option label="平板" value="平板"></el-option>
          <el-option label="家电" value="家电"></el-option>
          <el-option label="手表" value="手表"></el-option>
          <el-option label="汽车" value="汽车"></el-option>
           <el-option label="耳机" value="耳机"></el-option>
        </el-select>

        <el-select v-model="sortType" placeholder="排序方式" @change="handleSearch">
          <el-option label="默认排序" value=""></el-option>
          <el-option label="价格升序" value="asc"></el-option>
          <el-option label="价格降序" value="desc"></el-option>
        </el-select>
      </div>

      <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';

const router = useRouter();
const searchQuery = ref('');
const minPrice = ref('');
const maxPrice = ref('');
const sortType = ref('');
const category = ref('');
const emit = defineEmits(['search']);

const handleSearch = () => {
  // 将所有搜索条件打包发送
  const searchParams = {
    keyword: searchQuery.value,
    minPrice: minPrice.value || null,
    maxPrice: maxPrice.value || null,
    category: category.value,
    sortOrder: sortType.value
  };

  emit('search', searchParams);
};
</script>

<style scoped>
.search-container {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-group {
  flex: 0 0 auto;
  width: 300px;
}

.price-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.price-separator {
  color: #909399;
  font-weight: bold;
}

.filter-group {
  display: flex;
  gap: 12px;
  flex: 0 0 auto;
}

.el-input {
  width: 140px;
}

.search-group .el-input {
  width: 300px;
}

.el-select {
  width: 140px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.el-button) {
  height: 40px;
  padding: 0 24px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-group,
  .price-group,
  .filter-group {
    width: 100%;
  }

  .el-select {
    width: 100%;
  }

  .filter-group {
    flex-direction: column;
  }
}
</style>