<template>
  <el-dialog :title="'状态修改'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-upload class="upload-demo"
               :action="uploadExc"
               :http-request="uploadFile"
               :before-upload="beforeAvatarUpload"
               ref="upload"
               :auto-upload="false"
               :on-change="handExcChange"
               :file-list="excFile"
               accept=".xls, .xlsx, .xlsm">
      <span>选择需要导入的文件</span>
      <el-button size="small"
                 type="primary">选择文件</el-button>
    </el-upload>
    <br>
    <span class="remark">请先下载Excel模板，录入相关数据之后再导入。</span>
    <br>
    <span class="modelDown"
          @click="downDown(uploadExcModal)">excel模板下载</span>
    <br>
    <el-radio-group v-model="uploadType">
      <el-radio label="0">德国企业账号</el-radio>
      <el-radio label="1">Noris银行</el-radio>
    </el-radio-group>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="visible = false;excFile=[]"><i class="iconfont erp-icon-quxiao"></i>取 消</el-button>
      <el-button type="primary"
                 :loading="$store.state.loading"
                 @click="submitUpload();"><i class="iconfont erp-icon-daoru"></i>导 入</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 导入导出
export default {
  data () {
    return {
      visible: false,
      // 导入的路径
      uploadExc: '',
      // 导入的格式
      excFile: [],

      dataForm: {
        sellStatus: '',
        prodClassify: ''
      },
      // 模板下载地址
      uploadExcModal:
        this.RmsUrl +
        'financialFlowOrders/exportModel?Authorization=' +
        sessionStorage.getItem('userSession') +
        '&type=', //  导入模板地址
      uploadType: ''
    }
  },
  methods: {
    init () {
      this.visible = true
    },

    // 当文件改变时调用，添加，成功，失败
    handExcChange () { },

    // 上传前的调用=>验证
    beforeAvatarUpload (file) {
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const extension3 = file.name.split('.')[1] === 'doc'
      const extension4 = file.name.split('.')[1] === 'docx'
      const isLt2M = file.size / 1024 / 1024 < 1024
      if (!extension && !extension2 && !extension3 && !extension4) {
        console.log('上传模板只能是 xls、xlsx、doc、docx 格式!')
      }
      if (!isLt2M) {
        console.log('上传模板大小不能超过 1G!')
      }
      return (extension || extension2 || extension3 || extension4) && isLt2M
    },

    // 自定义上传
    uploadFile (options) {
      // let data = new FormData();
      // data.append(options.filename, options.file);
      // var url = 'financialFlowOrders/importFinlowOrders';
      // this.httpPost(url,data).then(({data}) => {
      //   if(data.result == true){
      //     this.$message(data.message);
      //     this.dialogFlag.isOpenLead = false;
      //     this.excFile=[];
      //     this.getRequirementList();
      //   }else{
      //     if(data.params.errorList.length>0){
      //       this.errorData = data.params.errorList;
      //       this.dialogFlag.isOpenErr = true;
      //     }else{
      //       this.$message(data.message);
      //     }
      //     this.excFile=[]
      //   }
      // })
    },

    // 导入文件
    submitUpload: function () {
      if (this.excName === '') {
        // this.$message('还未选择导入文件！')
        this.$notify.error({
          title: '错误',
          message: '还未选择导入文件！',
          duration: 5000
        })
      }
      if (this.excList.length >= 2) {
        // this.$message('只能导入一个文件，请把其它文件移除！')
        this.$notify.error({
          title: '错误',
          message: '只能导入一个文件，请把其它文件移除！',
          duration: 5000
        })
      } else {
        this.$refs.upload.submit()
      }
    },

    // 模板下载
    downDown (url) {
      window.open(url)
    }
  }
}
</script>
