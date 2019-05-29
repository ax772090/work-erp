<template>
  <div class="main">
    <h3>上传【亚马逊广告】报表</h3>
    <el-form :model="dataForm"
             :label-position="labelPosition"
             :rules="dataRule"
             ref="dataForm"
             class="form-ad-fiy">
      <el-form-item label="店铺名称"
                    prop="channel_id">
        <select-all v-model="dataForm.channel_id"
                    :listDataOption="channelIdOptions"
                    data-value="id"
                    data-label="name"></select-all>
      </el-form-item>
      <el-form-item label="广告类型"
                    prop="rpt_type">
        <select-all v-model="dataForm.rpt_type"
                    :listDataOption="adTypeOptions"
                    data-value="id"
                    data-label="name"></select-all>
      </el-form-item>
      <el-form-item label="文件">
        <el-upload :http-request="uploadFile"
                   class="upload-demo"
                   action="string"
                   ref="upload"
                   :limit='1'
                   accept='.xls,.xlsx,.xlsm'
                   :on-change="handleFileChange"
                   :on-remove="handleRemove"
                   :on-exceed="handleExceed"
                   :file-list="fileList"
                   :auto-upload="false">
          <span slot="tip"
                class="el-upload__tip">只能上传文件类型为.xls,.xlsx,.xlsm的文件</span>
          <el-button slot="trigger"
                     size="small"
                     type="primary">选择文件</el-button>
          <br>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitImport">上传</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import selectAll from '@/components/erp-select/select-all'
export default {
  components: {
    selectAll
  },
  data () {
    return {
      labelPosition: 'top',
      adTypeOptions: [{
        id: '01',
        name: 'Sponsored Products Advertised product report'
      }, {
        id: '02',
        name: 'Sponsored Brands Campaign report'
      }],
      dataForm: {
        channel_id: '',
        rpt_type: '',
        file: ''
      },
      dataRule: {
        channel_id: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        rpt_type: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      channelIdOptions: [],
      fileList: []
    }
  },
  created () {
    this.getDataUrl()
  },
  methods: {
    getDataUrl () {
      this.$http
        .get(this.$http.adornUrl('list/combobox/ownChannel'), {
          params: { platformType: '' }
        })
        .then(({ data }) => {
          this.channelIdOptions = data.list
          this.dataForm.channel_id = this.channelIdOptions[0].id
        })
      this.dataForm.rpt_type = this.adTypeOptions[0].id
    },
    handleRemove (file, fileList) {
      this.fileList = fileList
    },
    handleFileChange (file, fileList) {
      this.fileList = fileList
    },
    submitImport () {
      if (this.fileList.length === 0) {
        this.$notify.warning({
          title: '警告',
          message: `请选择导入文件`,
          duration: 2000
        })
      } else {
        this.$refs.upload.submit()
      }
    },
    handleExceed (files, fileList) {
      this.$notify.warning({
        title: '提示',
        message: `只支持上传一个文件`,
        duration: 3000
      })
    },
    // 自定义上传
    uploadFile (options) {
      console.log('options:', options)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let data = new FormData()
          data.append(options.filename, options.file)
          data.append('channel_id', this.dataForm.channel_id)
          data.append('rpt_type', this.dataForm.rpt_type)
          this.$http({
            url: this.$http.adornUrl(`datacenter/api/upload/ams-ad`, false),
            method: 'post',
            data: data
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$notify.success({
                title: '成功',
                message: '导入成功',
                duration: 5000
              })
              this.fileList = []
            } else {
              this.$notify.error({
                title: '失败',
                message: data.msg,
                duration: 3000
              })
            }
          })
        } else {
          return false
        }
      })
    }

  }
}
</script>
<style scoped>
.main {
  margin-left: 50px;
  margin-top: 50px;
}
</style>
<style lang='scss'>
.form-ad-fiy {
  .el-upload {
    border: 0px;
  }
  .el-form-item__label {
    line-height: 24px;
    padding-bottom: 5px;
  }
  .el-form-item {
    margin-bottom: 4px;
  }
  .upload-demo {
    width: 360px;
  }
  .el-select,
  .el-input {
    max-width: 400px;
  }
}
</style>


