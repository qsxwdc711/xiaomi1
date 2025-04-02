<template>
  <el-dialog title="添加商品" v-model="dialogVisible" width="500px">
    <el-form :model="productForm" :rules="rules" ref="productFormRef" label-width="100px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="productForm.name" placeholder="请输入商品名称"></el-input>
      </el-form-item>

      <el-form-item label="商品图片" prop="img">
        <el-upload action="/api/product/fileUpload" method="post" name="file" list-type="picture-card"
          :auto-upload="true" :limit="1" :on-success="handleImageSuccess" :on-error="handleImageError"
          :file-list="fileList">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="商品价格" prop="price">
        <el-input-number v-model="productForm.price" :precision="2" :step="0.1" :min="0"></el-input-number>
      </el-form-item>

      <el-form-item label="商品数量" prop="count">
        <el-input-number v-model="productForm.count" :min="0" :step="1"></el-input-number>
      </el-form-item>

      <el-form-item label="商品分类" prop="category">
        <el-select v-model="productForm.category" placeholder="请选择商品分类">
          <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { addProduct } from '../api/product';

const dialogVisible = ref(false);
const productFormRef = ref(null);
const fileList = ref([]);

// 固定的分类选项
const categoryOptions = [
  '笔记本',
  '手机',
  '平板',
  '家电',
  '手表',
  '汽车',
  '耳机'
];

const productForm = ref({
  name: '',
  img: '',
  price: 0,
  count: 0,
  favorite: 0,
  category: ''
});

const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  img: [
    { required: true, message: '请上传商品图片', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  count: [
    { required: true, message: '请输入商品数量', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请输入商品分类', trigger: 'blur' }
  ]
};

const handleImageSuccess = (response, file, fileList) => {
  console.log('上传成功:', response);
  if (response.code === 200) {
    productForm.value.img = response.data; // 使用 response.data 获取图片URL
    ElMessage.success('图片上传成功');
  } else {
    ElMessage.error('图片上传失败');
  }
};

const handleImageError = (err, file, fileList) => {
  console.error('上传失败:', err);
  ElMessage.error('图片上传失败，请重试');
};

const handleSubmit = () => {
  productFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await addProduct(productForm.value);

        if (response.code === 200) {
          ElMessage.success('添加商品成功');
          dialogVisible.value = false;
          // 重置表单
          productFormRef.value.resetFields();
          fileList.value = []; // 清空文件列表
          // 触发父组件的刷新方法
          emit('refresh');
        } else {
          ElMessage.error('添加商品失败');
        }
      } catch (error) {
        ElMessage.error('服务器连接失败，请稍后重试');
      }
    }
  });
};

// 暴露方法给父组件
const open = () => {
  dialogVisible.value = true;
};

defineExpose({
  open
});

const emit = defineEmits(['refresh']);
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>