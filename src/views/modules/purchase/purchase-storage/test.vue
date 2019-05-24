<template>
  <el-dialog :close-on-click-modal="false"
             :visible.sync="visible"
             width="70%">
    <div ref="pppccc">
      <storagePrint :dataForm="dataForm"></storagePrint>
    </div>
  </el-dialog>
</template>
<script>
// 表格
import erpTable from '@/components/erp-table/table-usually'
import storagePrint from '@/components/print'
import { setTimeout } from 'timers'
export default {
  components: {
    erpTable,
    storagePrint
  },
  name: 'test',
  data () {
    return {
      visible: false,
      dataForm: {
        title: '采购入库单', // 标题
        compName: '', // 公司名称
        printTime: new Date(), // 打印时间
        dataTable: {
          tr: [
            // 表头数据 —— className:列的class名
            {
              label: '源采购订单号',
              prop: 'poCode'
            },
            {
              label: '产品编码',
              prop: 'prodCode'
            },
            {
              label: '产品名称',
              prop: 'prodName'
            },
            {
              label: '单位',
              prop: 'unitName'
            },
            {
              label: '采购数量',
              prop: 'poQty'
            },
            {
              label: '入库数量',
              prop: 'qty'
            },
            {
              label: '库存状态',
              prop: 'inventoryStatusName'
            },
            {
              label: '备注',
              prop: 'remark'
            }
          ],

          data: [] // 表格数据 —— 如需添加行class，处理数据时则需要传入class名， class需为数组
        },
        detail1: [
          {
            label: '供应商：',
            key: 'supplierName',
            value: ''
          },
          {
            label: '入库单号：',
            key: 'code',
            value: ''
          },
          {
            label: '单据状态：',
            key: 'statusName',
            value: ''
          }
        ],
        detail2: [
          {
            label: '仓管员：',
            key: 'userName',
            value: ''
          },
          {
            label: '收货仓库：',
            key: 'warehouseName',
            value: ''
          },
          {
            label: '备注：',
            key: 'updUser',
            value: ''
          }
        ],
        footer: [
          {
            label: '制单：',
            key: 'addUserName',
            value: ''
          },
          {
            label: '审核：',
            key: 'addUserName',
            value: ''
          },
          {
            label: '验收：',
            key: '',
            value: ''
          },
          {
            label: '记账：',
            key: '',
            value: ''
          }
        ],
        currentPage: '1', // 当前页
        countPage: '1' // 总页数
      }
    }
  },
  mounted: function () {
    this.storageDetailData(window.sessionStorage.getItem('proId'))
  },
  methods: {
    // 获取采购入库的详情
    storageDetailData (id) {
      this.$http
        .get(this.$http.adornUrl(`/warehouse/whinstockpo/info/${id}`))
        .then(({ data }) => {
          if (data && data.code === 0) {
            for (const keys in data.poInstockDto) {
              if (data.poInstockDto.hasOwnProperty(keys)) {
                const item = data.poInstockDto[keys]
                for (const element of this.dataForm.detail1) {
                  if (element.key === keys) {
                    element.value = item
                  }
                }
                for (const element of this.dataForm.detail2) {
                  if (element.key === keys) {
                    element.value = item
                  }
                }
                for (const element of this.dataForm.footer) {
                  if (element.key === keys) {
                    element.value = item
                  }
                }
              }
            }
            this.dataForm.poCode = 'wx'
            this.dataForm.compName = data.poInstockDto.companyName
            this.dataForm.printTime = new Date().toLocaleString()
            this.dataForm.dataTable.data = data.poInstockDto.poInstockDetail
          }
        })
    },
    init () {
      this.visible = true
      this.storageDetailData(window.sessionStorage.getItem('proId'))
      this.$nextTick(() => {
        let newContent = this.$refs.pppccc.innerHTML
        document.body.innerHTML = newContent
        window.print()
      })
      this.$nextTick(() => {
        this.visible = false
      })
    }
    //   printContent(){
    //     let wpt = document.getElementById('table-content');
    //     let newContent = wpt.innerHTML;
    //     let oldContent = document.body.innerHTML;

    //     document.body.innerHTML = newContent;
    //     window.print(); //打印方法
    //     window.localtion.reload();
    //     document.body.innerHTML = oldContent;
    // },
  },
  watch: {
    // 初始外部用v-model传的值
    value: {
      // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        this.dataForm = this.value
        this.$emit('change', this.dataForm)
      },
      deep: true
    },

    // 当前组件变动后，抛出事件
    dataForm: {
      // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        this.$emit('input', this.dataForm) // 用于出发v-model原始事件，避免父级其他监听
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.el-select,
.el-date-editor {
  width: 100%;
}

.item {
  margin-bottom: 20px;
  margin-left: 50px;
  font-size: 16px;
  font-weight: 600;
}
.floatright {
  float: right;
}

.imglist {
  cursor: pointer;
  width: 100px;
}
.imglistPopover {
  max-width: 600px;
}
.title {
  font-size: 20px;
}
.row-bg {
  padding: 10px 0;
}
el-form-item {
  min-width: 36px;
}
.el-col {
  height: 36px;
}
</style>