<template>
  <div>
    <!-- -------------------批量导入弹出框------------------ -->
    <el-dialog :title='title'
               :visible.sync="importVisible"
               width="30%"
               :before-close="beforeCloseChange"
               :close-on-click-modal="false">
      <el-upload class="upload-demo"
                 :http-request="uploadFile"
                 action="string"
                 ref="upload"
                 v-loading="dataListLoading"
                 element-loading-text="拼命加载中"
                 :auto-upload="false"
                 :on-change="handleFileChange"
                 :file-list="fileList"
                 accept='.xls,.xlsx,.xlsm'
                 :limit='1'
                 :on-exceed="handleExceed"
                 :on-remove="handleRemove">
        <span>选择需要导入的文件</span>
        <el-button size="small"
                   type="primary">选择文件</el-button>
      </el-upload><br />
      <label>重复数据：</label>
      <el-radio-group v-model="radio"
                      :disabled='isDisabled'>
        <el-radio :label="1">忽略</el-radio>
        <el-radio :label="2">覆盖导入</el-radio>
      </el-radio-group><br />
      <span class="remark">请先下载Excel模板，录入相关数据之后再导入。</span><br />
      <span class="modelDown"
            @click="downloadTemplate()">excel模板下载</span>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="importVisible = false;fileList=[]">取 消</el-button>
        <el-button type="primary"
                   @click="submitImport();">导 入</el-button>
      </div>
    </el-dialog>
    <!-- ------------------批量导入导常弹出框------------------- -->
    <el-dialog title="异常提示"
               :visible.sync="errVisible"
               :before-close="beforeCloseError"
               width="40%">
      <!-- <div> -->
      <!-- <i class="el-icon-success"></i> -->
      <el-alert :title="successTitle"
                type="success"
                :closable='false'
                show-icon>
      </el-alert>
      <!-- <strong>导入成功</strong><span>{{successNum}}条!</span> -->
      <!-- </div> -->
      <!-- <div> -->
      <el-alert :title="failTitle"
                type="error"
                :closable='false'
                show-icon>
      </el-alert>
      <!-- <strong>导入失败</strong><span>{{failNum}}条!</span> -->
      <!-- </div> -->
      <!-- <div> -->
      <el-row class="mt-10">
        <label class="item">导入失败详情:</label>
        <el-button class="fr"
                   type="primary"
                   @click="excelExport()">下载失败报告</el-button>
      </el-row>
      <!-- </div> -->
      <div id="item_list">
        <el-table :data="errorData"
                  border
                  tooltip-effect="dark"
                  :max-height="500">
          <el-table-column prop="cellName"
                           label="坐标"
                           align="center"></el-table-column>
          <el-table-column prop="cellValue"
                           label="错误信息"
                           align="center"></el-table-column>
          <el-table-column prop="errorDesc"
                           label="描述"
                           align="center"></el-table-column>
          <el-table-column prop="errorType"
                           label="错误类型"
                           align="center"></el-table-column>
        </el-table>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeHandle">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    title: { default: '导入' }       // 标题
    // templateUrl: { default: '' },     // 模析下载Url
    // importUrl: { default: '' }       // 导入url
  },

  data () {
    return {
      failTitle: '',
      successTitle: '',
      successNum: '',
      failNum: '',
      radio: 1,
      dataListLoading: false,
      importVisible: false,
      fileName: '',
      fileList: [],
      errorData: [],
      errVisible: false,
      templateUrl: '',
      importUrl: '',
      uploadFailUrl: '',
      isDisabled: false,
      feeType: ''
    }
  },

  methods: {
    init (obj) {
      this.radio = 1
      // this.fileList = []
      this.importVisible = true
      this.templateUrl = obj.templateUrl
      this.importUrl = obj.importUrl
      this.uploadFailUrl = obj.uploadFailUrl
      this.isDisabled = obj.isDisabled
      this.feeType = obj.feeType
    },

    downloadTemplate () {
      // this.$http.tokens(this.templateUrl, this.searchData)
      window.open(this.$http.tokens(this.templateUrl))
    },

    submitImport () {
      if (this.fileName === '') {
        this.$notify.warning('还未选择导入文件！')
      } if (this.fileList.length >= 2) {
        this.$notify.warning('只能导入一个文件，请把其它文件移除！')
      } else {
        this.$refs.upload.submit()
      }
    },

    handleExceed (files, fileList) {
      this.$notify.warning({
        title: '提示',
        message: `只支持上传一个文件`,
        duration: 5000
      })
    },

    handleRemove (file, fileList) {
      this.fileName = ''
      this.fileList = fileList
    },

    handleFileChange (file, fileList) {
      this.fileName = file.name
      this.fileList = fileList
    },

    closeHandle () {
      this.errVisible = false
      this.fileList = []
      this.importVisible = false
      this.$emit('refreshDataList', 1)
    },

    beforeCloseChange (val) {
      this.fileList = []
      this.importVisible = false
    },
    beforeCloseError (val) {
      this.fileList = []
      this.errVisible = false
      this.importVisible = false
      // 关闭后刷新列表
      this.$emit('refreshDataList', 1)
    },

    // 自定义上传
    uploadFile (options) {
      let data = new FormData()
      data.append(options.filename, options.file)
      data.append('condition', this.radio)
      if (this.feeType) {
        data.append('feeType', this.feeType)
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(this.importUrl, false),
        method: 'post',
        data: data
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataListLoading = false
          this.importVisible = false
          this.$emit('refreshDataList', 1)
          this.$notify.success({
            title: '成功',
            message: '全部导入成功',
            duration: 5000
          })
          this.fileList = []
        } else {
          this.dataListLoading = false
          if (data.hasOwnProperty('errorList') && data.errorList.length > 0) {
            this.errorData = data.errorList
            if (data.results) {
              this.successTitle = `导入成功${data.results.successNum}条！`
              this.failTitle = `导入失败${data.results.failNum}条！`
            } else {
              this.successTitle = `导入成功0条！`
              this.failTitle = `导入失败0条！`
            }
            this.errVisible = true
          } else {
            this.$notify.error({
              title: '上传失败',
              message: data.msg,
              duration: 5000
            })
          }
          this.fileList = []
        }
      })
    },

    // 失败报告导出
    excelExport () {
      if (this.feeType) {
        window.open(
          this.$http.tokens(this.uploadFailUrl, { feeType: this.feeType })
        )
      } else {
        window.open(
          this.$http.tokens(this.uploadFailUrl)
        )
      }
    }
  }
}
</script>
<style scoped>
.remark {
  color: red;
  font-size: 12px;
}

.modelDown {
  position: absolute;
  bottom: 20px;
  color: #297dfa;
  cursor: pointer;
}

.item {
  float: left;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 600;
}
</style>
