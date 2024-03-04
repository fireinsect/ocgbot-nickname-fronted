<template>
  <div>
    <div class="dialog-content" style="display: flex;">
      <el-form
        ref="dataForm"
        class="dataForm"
        :rules="rules"
        :model="data"
        label-position="right"
        label-width="60px"
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
          <el-button type="mini" icon="el-icon-search" @click="getCardList(data.name)" />
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
      <el-table
        key="tableKey"
        v-loading="listLoading"
        :data="list"
        fit
        highlight-current-row
        height="350px"
      >
        <span>

          <el-table-column label="cardId" prop="cardId" align="center" min-width="80px">
            <template slot-scope="{row}">
              <span>{{ row.cardId }}</span>
            </template>
          </el-table-column>

          <el-table-column label="name" prop="name" align="center" min-width="80px">
            <template slot-scope="{row}">
              <el-popover
                v-show="hoverCardId===row.cardId"
                ref="hover-name"
                placement="bottom"
                :title="row.name"
                width="200px"
                close-delay="50"
                trigger="hover"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
              >
                <el-image
                  fit="contain"
                  style="width: 150px;height: 150px; padding: 0;margin: 0"
                  :src="'https://fireinsect.top/ocgBot/ocg-bot/src/static/pics/'+row.cardId+'.jpg'"
                />
              </el-popover>
              <span v-popover:hover-name @mouseover="hoverHandler(row.cardId)" @click="paddingName(row.name)">{{ row.name }}</span>
            </template>
          </el-table-column>
        </span>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer" style="margin-top: 20px">
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
import { addNickName, getCard, updateNickName } from '@/api/nickName'
import NickNameObject from '@/views/nickName/components/nickName'
import { Message } from 'element-ui'

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
      emo: [],
      messages: [],
      hoverModel: false,
      hoverCardId: '',
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
  created() {
    const that = this
    fetch('/text.json')
      .then((response) => response.json())
      .then((res) => {
        that.emo = res.emo
        that.messages = res.messages
      })
  },
  methods: {
    hoverHandler(carId) {
      this.hoverCardId = carId
      // this.hoverModel = !this.hoverModel
    },
    paddingName(name) {
      if (this.data.nkType === 0) {
        this.data.name = name
      }
    },
    updateData() {
      const vh = window.innerHeight / 4
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.data)
          this.confirmLoading = true
          if (tempData.id === 0 || tempData.id == null) {
            addNickName(tempData).then((res) => {
              this.confirmLoading = false
              if (res.code === 204) {
                Message({
                  message: res.message || 'Error',
                  type: 'error',
                  duration: 5 * 1000
                })
              } else {
                that.dialogVisible()
                this.$notify({
                  title: 'Success',
                  message: '添加成功啦(￣▽￣)~*',
                  type: 'success',
                  duration: 2000
                })
                const positions = ['bottom-right', 'bottom-left', 'top-left', 'top-right']
                // const emo = ['٩(๑>◡<๑)۶', '(ﾉ・∀・)ﾉ ', '(・▽・*) ', 'ヾ(✿・▽・)ノ', 'φ(>ω<*) ', '(=´ω｀=)', '(｀・ω・´)', '(｡◕ˇ∀ˇ◕)']
                // const messages = ['感谢你的贡献！', '谢谢你！', '好耶！', '别名增加了！', '牛牛减1cm！', '谢谢你的贡献！', '等待审核吧！', '记得留下你的名字吧！', '牛牛变大魔法！', '丢~', '嘟嘟嘟！']
                const messages = that.messages
                const emo = that.emo
                for (let i = 0; i < 20; i++) {
                  setTimeout(function() {
                    const offset = Math.floor(Math.random() * vh)
                    const position = positions[Math.floor(Math.random() * positions.length)]
                    that.$notify({
                      title: messages[Math.floor(Math.random() * messages.length)] + emo[Math.floor(Math.random() * emo.length)],
                      message: messages[Math.floor(Math.random() * messages.length)] + emo[Math.floor(Math.random() * emo.length)],
                      duration: 2000,
                      position: position,
                      offset: offset
                    })
                  }, 600 * i)
                }
              }
            })
          } else {
            updateNickName(tempData).then((res) => {
              this.confirmLoading = false
              if (res.code === 204) {
                Message({
                  message: res.message || 'Error',
                  type: 'error',
                  duration: 5 * 1000
                })
              } else {
                that.dialogVisible()
                this.$notify({
                  title: 'Success',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
          }
        }
      })
    },
    getCardList(name) {
      this.listLoading = true
      const param = {
        'name': name
      }
      getCard(param).then(response => {
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
@media screen and (max-width: 992px) {
  .dialog-content{
    flex-direction: column;
  }
}

@media screen and (min-width: 1200px) {
  .dialog-content {
    flex-direction: row;
    .dataForm{
      width: 400px;
      margin-right: 20px;
    }
  }
}

</style>
