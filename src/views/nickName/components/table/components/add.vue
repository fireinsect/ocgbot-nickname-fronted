<script>
export default {
  name: 'NickAdd',
  data() {
    return {
      pvData: [],
      dialogPvVisible: false
    }
  },
  methods: {

  }
}
</script>

<template>
  <div>
    <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="key" label="Channel" />
      <el-table-column prop="pv" label="Pv" />
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
    </span>
  </div>
</template>

<style scoped>

</style>
