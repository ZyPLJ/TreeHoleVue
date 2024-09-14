<template>
  <el-dialog
      v-model="centerDialogVisible"
      title="审核评论"
      width="500"
      align-center
  >
    <el-form
        label-width="auto"
        style="max-width: 600px"
        :model="formLabelAlign"
    >
      <el-form-item label="原因">
        <el-input v-model="formLabelAlign.reason" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="auditPass()" >
          通过
        </el-button>
        <el-button type="danger" @click="auditNotPass()" >
          拒绝
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import { acceptComment,rejectComment } from '../../http/modules/comment'
import { ElMessage } from 'element-plus'

const centerDialogVisible = ref(false)
const formLabelAlign = reactive({
  reason: '',
})
const auditid = ref(0)

const dialogshow = (id: number) => {
  console.log('dialogshow', id)
  auditid.value = id
  centerDialogVisible.value = true;
};
defineExpose({ dialogshow });
const emit = defineEmits(['load'])

//审核通过
const auditPass = async () => {
  try {
    const res = await acceptComment(auditid.value, formLabelAlign)
    if (res.statusCode === 200) {
      ElMessage.success('审核通过')
    } else {
      ElMessage.error('审核失败')
    }
  } catch (error) {
    ElMessage.error(error.message)
  }finally {
    centerDialogVisible.value = false;
    auditid.value = 0;
    formLabelAlign.reason = '';
    //调用父组件方法
    emit('load')
  }
}
//审核不通过
const auditNotPass = async () => {
  try {
    const res = await rejectComment(auditid.value, formLabelAlign)
    if (res.statusCode === 200) {
      ElMessage.success('拒绝成功')
    } else {
      ElMessage.error('拒绝失败')
    }
  } catch (error) {
    ElMessage.error(error.message)
  }finally {
    centerDialogVisible.value = false;
    auditid.value = 0;
    formLabelAlign.reason = '';
    //调用父组件方法
    emit('load')
  }
}
</script>