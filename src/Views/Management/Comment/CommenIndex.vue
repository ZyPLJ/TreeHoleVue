<script setup lang="ts">
import {ref} from 'vue'
import {Delete,Check} from '@element-plus/icons-vue'
import { getApiList,delteComment } from '../../../http/modules/comment'
import { formatTime } from '../../../utils/dateTime';
import { logincookie,getToken } from "../../../utils/auth";
import { ElMessage, ElMessageBox } from 'element-plus'

const currentPage = ref(1);
const pageSize = ref(20);
const totalCount = ref(1000);
const tableData = ref();
const token = ref('')
const disabled = ref(false)

const load = async () => {
  token.value = getToken();
  if(token.value !== "" && token.value !== undefined){
    disabled.value = true;
  }
  const res = await getApiList( pageSize.value,currentPage.value);
  const format = 'yyyy-MM-dd HH:mm:ss';
  tableData.value = res.data.map((item) => {
    return {
      ...item,
      createTime: formatTime(item.createTime, format)
    }
  });
  totalCount.value = res.pagination.totalItemCount;
}

const handleSizeChange =async (pSize) => {
  pageSize.value = pSize;
  await load()
};
const handleCurrentChange =async (page) => {
  currentPage.value = page;
  await load()
};

const handleDelete = (index: number, row) => {
  console.log(index, row.id)
  ElMessageBox.confirm(
      '确定删除该评论?',
      '提示',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true,
      }
  )
      .then(async () => {
          try{
            const res =  await delteComment(row.id)
            if(res.statusCode=== 200){
              ElMessage({
                type: 'success',
                message: res.message,
              })
            }else{
              ElMessage({
                type: 'error',
                message: res.message,
              })
            }
          }catch (err){
            ElMessage({
              type: 'error',
              message: err.message,
            })
          }
      }).finally(() => {
          load()
      })
}

const handleAddToken = () => {
  disabled.value = !disabled.value;
  let tokenCookie = getToken();
  if (tokenCookie) {
    return false
  }
  if (token.value) {
    // 获取当前时间
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);
    logincookie(token.value, 'zy', currentDate)
  }
}

const filterTag = (value: string, row) => {
  return row.visible === value
}
load()
</script>

<template>
  <el-container>
    <el-header height="60px" style="display: flex; justify-content: flex-end;">
      <el-button type="danger" :icon="Delete">删除</el-button>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="6"><el-input v-model="token" placeholder="设置token" :disabled="disabled" /></el-col>
        <el-col :span="4"><el-button type="success" :icon="Check" circle @click="handleAddToken"/></el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%" table-layout="fixed">
        <el-table-column type="selection" width="55" />
        <el-table-column property="content" label="内容" />
        <el-table-column property="createTime" label="时间" sortable  />
        <el-table-column
            prop="tag"
            label="可见"
            width="100"
            :filters="[
        { text: '可见', value: true },
        { text: '不可见', value: false },
      ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
        >
          <template #default="scope">
            <el-tag
                :type="scope.row.visible === true ? 'success' : 'warning'"
                disable-transitions
            >{{ scope.row.visible }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
            property="reason"
            label="原因"
            show-overflow-tooltip
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="" :disabled="!scope.row.isNeedAudit">
              审核
            </el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
  <el-footer>
    <div class="demo-pagination-block">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[20, 50, 100, 500]"
          background
          layout="total, prev, pager, next,sizes"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </el-footer>
</template>

<style scoped>

</style>