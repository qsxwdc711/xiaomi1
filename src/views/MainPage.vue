<template>
  <div class="main-container">
    <HeaderNav />
    <div class="top-section">
      <SearchBar @search="handleSearch" />
      <el-button type="primary" @click="handleAddProduct" class="add-button">添加商品</el-button>
    </div>

    <el-main class="product-list" v-loading="loading">
      <template v-if="products && products.length > 0">
        <ProductCard v-for="product in products" :key="product.id" :product="product"
          :isFavorite="isProductFavorite(product)" @addToCart="addToCart" @toggleFavorite="toggleFavorite"
          @remove="handleRemoveProduct" @edit="handleEditProduct" />
      </template>
      <el-empty v-else description="暂无商品" />
    </el-main>

    <el-pagination
      v-if="total > 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage + 1"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="pagination"
    />

    <el-footer class="footer">
      <p>版权所有 &copy; 2024 商城示例</p>
    </el-footer>

    <!-- 使用AddProduct组件 -->
    <AddProduct ref="addProductRef" @refresh="refreshProducts" />

    <!-- 修改商品对话框 -->
    <el-dialog v-model="showEditProductDialog" title="修改商品信息" class="product-form-dialog">
      <el-form :model="editedProduct" ref="editProductForm" :rules="rules" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="editedProduct.name" placeholder="请输入商品名称（不超过30字）" maxlength="30" show-word-limit />
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="editedProduct.price" :min="0" :precision="2" controls-position="right"
            style="width: 200px" />
        </el-form-item>

        <el-form-item label="商品分类" prop="category">
          <el-select v-model="editedProduct.category" placeholder="请选择分类">
            <el-option label="笔记本" value="笔记本"></el-option>
            <el-option label="手机" value="手机"></el-option>
            <el-option label="平板" value="平板"></el-option>
            <el-option label="家电" value="家电"></el-option>
            <el-option label="手表" value="手表"></el-option>
            <el-option label="汽车" value="汽车"></el-option>
                <el-option label="耳机" value="耳机"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品图片" prop="img">
          <el-upload action="/api/product/fileUpload" method="post" name="file"
            list-type="picture-card" :auto-upload="true" :limit="1" :on-success="handleEditImageSuccess"
            :on-error="handleEditImageError" :file-list="editFileList">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelEditProduct">取消</el-button>
          <el-button type="primary" :loading="editSubmitLoading" @click="submitEditProductForm">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import HeaderNav from '../components/HeaderNav.vue'
import SearchBar from '../components/SearchBar.vue'
import ProductCard from '../components/ProductCard.vue'
import AddProduct from '../components/AddProduct.vue'
import { deleteProduct, getProducts, addProduct, updateProduct } from '../api/product'

const route = useRoute()
// 接收父组件传递的分类数据
const props = defineProps(['categories'])

// 商品数据
const products = ref([])
const total = ref(0) // 总商品数

// 查询参数
const searchKeyword = ref('')
const currentPage = ref(0) // 后端分页从0开始
const pageSize = ref(10)  // 修改为10，显示两行
const minPrice = ref(null)
const maxPrice = ref(null)
const sortOrder = ref(null)
const searchCategory = ref('') // 添加搜索分类参数

// 修改商品相关
const showEditProductDialog = ref(false)
const editedProduct = ref({
  id: null,
  name: '',
  price: 0,
  img: '',
  category: ''
})
const editProductForm = ref(null)
const editSubmitLoading = ref(false)
const editFileList = ref([]);

const loading = ref(false);  // 添加加载状态

// 获取商品列表
const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = {
      keyword: searchKeyword.value,
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
      sortOrder: sortOrder.value,
      category: searchCategory.value,
      page: currentPage.value,
      size: pageSize.value
    };

    console.log('发送请求参数:', params);

    const response = await getProducts(params);
    console.log('接收到响应:', response);

    if (response.code === 200 && response.data) {
      // 适配新的数据结构
      products.value = response.data.content || [];
      total.value = response.data.totalElements || 0;
      console.log('处理后的商品列表:', products.value);
      console.log('总数量:', total.value);
    } else {
      ElMessage.error(response.message || '获取商品列表失败');
    }
  } catch (error) {
    console.error('请求错误:', error);
    if (error.code === 'ERR_NETWORK') {
      ElMessage.error('无法连接到服务器，请检查网络连接');
    } else {
      ElMessage.error('请求失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = (searchParams) => {
  console.log('搜索参数:', searchParams);
  searchKeyword.value = searchParams.keyword;
  minPrice.value = searchParams.minPrice;
  maxPrice.value = searchParams.maxPrice;
  sortOrder.value = searchParams.sortOrder || '';
  searchCategory.value = searchParams.category || ''; // 更新搜索分类
  currentPage.value = 0; // 重置页码
  fetchProducts();
};

// 价格区间处理
const handlePriceRangeChange = (min, max) => {
  minPrice.value = min
  maxPrice.value = max
  currentPage.value = 0 // 重置页码
  fetchProducts()
}

// 排序处理
const handleSort = (order) => {
  if (order === 'asc') {
    sortOrder.value = 'asc'; // 升序
  } else if (order === 'desc') {
    sortOrder.value = 'desc'; // 降序
  } else {
    sortOrder.value = ''; // 未选择排序方式
  }
  currentPage.value = 0; // 重置页码
  fetchProducts();
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 0 // 重置页码
  fetchProducts()
}

const handleCurrentChange = (page) => {
  currentPage.value = page - 1 // 转换为后端的页码（从0开始）
  fetchProducts()
}

// 下架商品
const handleRemoveProduct = (productId) => {
  ElMessageBox.confirm('确定要下架该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const response = await deleteProduct(productId)
      if (response.code === 200) {
        ElMessage.success('下架成功')
        fetchProducts() // 重新获取商品列表
      } else {
        ElMessage.error('下架失败')
      }
    } catch (error) {
      ElMessage.error('服务器连接失败，请稍后重试')
    }
  }).catch(() => {
    // 用户点击取消，不做任何操作
  })
}

// 页面加载时获取商品列表
onMounted(() => {
  fetchProducts()
})

// 监听路由参数变化
watch(
  () => route.query,
  (newQuery) => {
    // 更新查询参数
    minPrice.value = newQuery.minPrice ? Number(newQuery.minPrice) : null
    maxPrice.value = newQuery.maxPrice ? Number(newQuery.maxPrice) : null
    sortOrder.value = newQuery.sort || null
    fetchProducts()
  },
  { immediate: true }
)

// 监听路由变化，从收藏页面返回时刷新数据
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (newPath === '/main' && oldPath === '/favorites') {
      fetchProducts();
    }
  }
);

// 新增商品相关
const showAddProductDialog = ref(false)
const newProduct = ref({
  id: Date.now(),
  name: '',
  price: 0,
  img: '',
  category: ''
})
const addProductForm = ref(null)
const submitLoading = ref(false)

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', message: '价格必须为数字', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请输入商品分类', trigger: 'blur' }],
}

// 图片上传处理
const handleEditImageSuccess = (response, file, fileList) => {
  console.log('图片上传返回:', response);
  if (response.code === 200) {
    editedProduct.value.img = response.data;
    console.log('图片URL已更新:', editedProduct.value.img);
    ElMessage.success('图片上传成功');
  } else {
    ElMessage.error('图片上传失败');
  }
};

const handleEditImageError = (err, file, fileList) => {
  console.error('编辑上传失败:', err);
  ElMessage.error('图片上传失败，请重试');
};

// 提交新增商品
const submitAddProductForm = async () => {
  addProductForm.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请正确填写所有必填项');
      return;
    }

    submitLoading.value = true;
    try {
      const response = await addProduct(newProduct.value);
      if (response.code === 200) {
        ElMessage.success('商品添加成功');
        cancelAddProduct();
        fetchProducts(); // 重新获取商品列表
      } else {
        ElMessage.error('添加商品失败');
      }
    } catch (error) {
      ElMessage.error('服务器连接失败，请稍后重试');
    } finally {
      submitLoading.value = false;
    }
  });
};

// 取消添加
const cancelAddProduct = () => {
  resetForm()
  showAddProductDialog.value = false
}

// 重置表单
const resetForm = () => {
  newProduct.value = {
    id: Date.now(),
    name: '',
    price: 0,
    img: '',
    category: ''
  }
  addProductForm.value.resetFields()
}

// 编辑商品
const handleEditProduct = (product) => {
  editedProduct.value = { ...product };
  // 如果商品已有图片，初始化文件列表
  if (product.img) {
    editFileList.value = [{
      name: 'current_image',
      url: product.img
    }];
  } else {
    editFileList.value = [];
  }
  showEditProductDialog.value = true;
};

// 提交修改商品
const submitEditProductForm = async () => {
  editProductForm.value.validate(async (valid) => {
    if (valid) {
      editSubmitLoading.value = true;
      try {
        console.log('提交的商品数据:', editedProduct.value); // 打印调试信息
        const response = await updateProduct(editedProduct.value);
        if (response.code === 200) {
          ElMessage.success('商品信息更新成功');
          showEditProductDialog.value = false;
          editProductForm.value.resetFields();
          editFileList.value = [];
          fetchProducts();
        } else {
          ElMessage.error('商品信息更新失败：' + (response.message || '未知错误'));
        }
      } catch (error) {
        console.error('更新商品错误:', error);
        ElMessage.error('请求失败，请稍后重试');
      } finally {
        editSubmitLoading.value = false;
      }
    }
  });
};

// 取消修改
const cancelEditProduct = () => {
  editedProduct.value = {}
  showEditProductDialog.value = false
  editProductForm.value.resetFields()
}

// 搜索和分页相关逻辑
const filteredProducts = computed(() => {
  let filtered = [...products.value]
  const { minPrice, maxPrice, sort } = route.query

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword))
  }

  if (minPrice) filtered = filtered.filter(p => p.price >= +minPrice)
  if (maxPrice) filtered = filtered.filter(p => p.price <= +maxPrice)

  if (sort === 'asc') filtered.sort((a, b) => a.price - b.price)
  if (sort === 'desc') filtered.sort((a, b) => b.price - a.price)

  return filtered
})

const currentPageProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProducts.value.slice(start, start + pageSize.value)
})

// 判断商品是否收藏
const isProductFavorite = (product) => {
  // 这里可以实现具体的判断逻辑，暂时返回 false
  return false
}

// 其他功能占位
const addToCart = product => console.log('加入购物车:', product)
const toggleFavorite = product => console.log('收藏:', product)

const addProductRef = ref(null)

// 打开添加商品对话框
const handleAddProduct = () => {
  addProductRef.value.open()
}

// 刷新商品列表
const refreshProducts = () => {
  fetchProducts(); // 调用获取商品列表的方法
}
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.product-list {
  display: grid;
   grid-template-columns: repeat(5, 220px);
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  margin: 0 auto;
  max-width: 1600px;
  min-height: 600px;
  /* 确保两行的最小高度 */
}

.el-pagination {
  margin: 20px 0;
  text-align: center;
}

.preview-container {
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-top: 10px;
}

.preview-image {
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 10px;
}

.footer {
  margin-top: auto;
  background: #f5f7fa;
  color: #606266;
  padding: 20px;
  text-align: center;
}

.el-dialog {
  width: 600px;
  max-width: 90%;
  border-radius: 12px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-weight: 500;
}

.el-input-number {
  width: 200px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.top-section .search-container {
  flex: 1;
}

.add-button {
  flex-shrink: 0;
  margin-top: 16px;
}
</style>