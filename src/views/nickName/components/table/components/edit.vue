<template>
  <div>
    <div style="display: flex; flex-direction: row-reverse">
      <el-table
        key="tableKey"
        v-loading="listLoading"
        style="margin-left: 20px"
        :data="list"
        fit
        highlight-current-row
        max-height="350px"
      >
        <el-table-column label="cardId" prop="cardId" align="center" min-width="80px">
          <template slot-scope="{row}">
            <span>{{ row.cardId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="name" prop="name" align="center" min-width="80px">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="data"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="类型" prop="nkType">
          <el-select v-model="data.nkType" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="卡名" prop="name">
          <el-input v-model="data.name" placeholder="请输入卡名" />
          <el-button type="mini" icon="el-icon-search" @click="getList(data.name)" />
        </el-form-item>
        <el-form-item label="别名" prop="nickName">
          <el-input v-model="data.nickName" placeholder="请输入别名" />
        </el-form-item>
        <el-form-item label="创建者" prop="creator">
          <el-input v-model="data.creator" type="text" placeholder="留下你的id~" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="data.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            maxlength="30"
            show-word-limit
            type="textarea"
            placeholder="输入备注"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible">
        取消
      </el-button>
      <el-button type="primary" :loading="confirmLoading" @click="updateData">
        确定
      </el-button>
    </div>
  </div>

</template>

<script>
import { addNickName, fetchCardList, updateNickName } from '@/api/nickName'
import NickNameObject from '@/views/nickName/components/nickName'

const calendarTypeOptions = [
  { key: 0, display_name: '单卡' },
  { key: 1, display_name: '一类卡' }
]
export default {
  name: 'NickEdit',
  props: {
    data: NickNameObject
  },
  data() {
    return {
      calendarTypeOptions,
      statusOptions: ['已上传', '待审核'],
      dialogFormVisible: false,
      listLoading: false,
      queryList: [],
      list: [],
      confirmLoading: false,
      rules: {
        nkType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入卡名', tigger: 'change' }],
        nickName: [{ required: true, message: '请输入别名', tigger: 'change' }]
      }
    }
  },
  methods: {
    updateData() {
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.data)
          this.confirmLoading = true
          if (tempData.id === 0 || tempData.id == null) {
            addNickName(tempData).then(() => {
              that.dialogVisible()
              this.$notify({
                title: 'Success',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
              this.confirmLoading = false
            })
          } else {
            updateNickName(tempData).then(() => {
              that.dialogVisible()
              this.$notify({
                title: 'Success',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
              this.confirmLoading = false
            })
          }
        }
      })
    },
    getList(name) {
      this.listLoading = true
      fetchCardList(name).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    clearList() {
      this.list = []
    },
    dialogVisible() {
      this.clearList()
      this.$emit('dialogVisible', false)
    }
  }
}
</script>

<style scoped>

</style>
