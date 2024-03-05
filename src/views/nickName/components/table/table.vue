<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="卡名" style="width: 300px; margin-right: 5px" class="filter-item" />
      <el-input v-model="listQuery.nickName" placeholder="别名" style="width: 300px; margin-right: 5px" class="filter-item" />
      <span class="form-option">
        <el-select v-model="listQuery.nkType" placeholder="类型" clearable class="filter-item" style="width: 147px;min-width: 70px;margin-right: 5px">
          <el-option v-for="item in nkTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 147px;min-width: 70px;">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </span>
      <div style="display: inline-block;">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
          搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          添加
        </el-button>
      </div>
      <el-button class="filter-item" style="float: right" type="info" @click="handlerGetJson">
        获取Json
      </el-button>
    </div>
    <el-table
      :data="resData.list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="80" sortable>
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡名" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="别名(自动转换为大写)" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nkType | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传者" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        class-name="status-col"
        width="150px"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status===0?"待审核":"已提交" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status!==1" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!==1 && checkPermission(['admin'])" size="mini" type="success" :loading="row.loading" @click="handleModifyStatus(row,1)">
            录用
          </el-button>
          <el-button v-if="row.status===1 && checkPermission(['admin'])" size="mini" type="warning" :loading="row.loading" @click="handleModifyStatus(row,0)">
            取消
          </el-button>
          <el-popconfirm
            title="确定删除？"
            @onConfirm="handleDelete(row)"
          >
            <el-button v-if="checkPermission(['admin'])" slot="reference" type="danger" size="mini" :loading="row.loading" style="margin-left:10px">
              删除
            </el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="resData.total>0" :total="resData.total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :width="dialogWidth" :close-on-click-modal="false" @close="closed">
      <NickEdit ref="edit" :data="temp" @dialogVisible="dialogVisible" />
    </el-dialog>
  </div>
</template>

<script>
import { deleteNickName, fetchList, getJson, useNickName } from '@/api/nickName'
import waves from '@/directive/waves' // waves directive
import NickEdit from '@/views/nickName/components/table/components/edit.vue'
import NickNameObject from '@/views/nickName/components/nickName'
import checkPermission from '@/utils/permission'
import Pagination from '@/components/Pagination'

const nkTypeOptions = [
  { key: 0, display_name: '单卡' },
  { key: 1, display_name: '一类卡' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = nkTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'NickTable',
  components: { NickEdit, Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      resData: null,
      listLoading: true,
      dialogWidth: '50%',
      temp: NickNameObject,
      listQuery: {
        total: 0,
        list: [],
        pageNum: 1,
        pageSize: 20
      },
      nkTypeOptions: nkTypeOptions,
      statusOptions: [
        { key: 0, display_name: '待审核' },
        { key: 1, display_name: '已提交' }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      }
    }
  },
  created() {
    this.getList()
    this.setWidth()
  },
  methods: {
    checkPermission,
    setWidth() {
      const vw = window.screen.width
      if (vw < 820) {
        this.dialogWidth = '90%'
      } else {
        this.dialogWidth = '50%'
      }
    },
    closed() {
      this.$refs.edit.clearList()
    },
    dialogVisible(visible) {
      this.getList()
      this.dialogFormVisible = visible
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        response.data.list.map(item => {
          this.$set(item, 'loading', false)
          return item
        })
        this.resData = response.data
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = new NickNameObject(undefined, '', '', '', '', '', '', 1, 10)
    },
    handlerGetJson() {
      getJson().then((res) => {
        this.saveJSON(res.data, 'nickname.json')
      })
    },
    saveJSON(jsonData, asFilename) {
      const filename = asFilename || `${(new Date()).toISOString()}.json`
      const data = typeof jsonData === 'object' ? JSON.stringify(jsonData, undefined, 2) : jsonData
      const blob = new Blob([data], { type: 'text/json' })
      const link = document.createElement('a')
      link.setAttribute('style', 'display: none')
      link.download = filename
      link.href = window.URL.createObjectURL(blob)
      link.dataset.downloadurl = ['text/json', link.download, link.href].join(':')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    handleSearch() {
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      if (row.status === 0 || this.checkPermission(['admin'])) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      }
    },
    handleDelete(row) {
      row.loading = true
      const tempData = Object.assign({}, row)
      deleteNickName(tempData).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.loading = false
        this.getList()
      })
    },
    handleModifyStatus(row, status) {
      row.loading = true
      const tempData = Object.assign({}, row)
      tempData.status = status
      useNickName(tempData).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.loading = false
        row.status = status
      })
    }
  }
}
</script>
<style scoped>
@media screen and (min-width: 1200px) {
  .form-option {
    margin-right: 50px;
  }
}
</style>
