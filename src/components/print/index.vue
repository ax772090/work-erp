<template>
    <div>
      <el-form :model="dataForm" ref="dataForm" >
        <el-row :gutter="20" style="margin-top:20px">
          <el-col :span="8" align="center">
            <div class="grid-content bg-purple">{{ dataForm.compName }}</div>
          </el-col>
          <el-col :span="8" align="center" :offset="8">
            <div class="grid-content bg-purple">打印时间：{{ dataForm.printTime }}</div>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col align="center" class="title">{{ dataForm.title }}</el-col>
        </el-row>
        <el-row style="padding:0 0 0 30px;margin-top:20px">
          <el-col :span="8" v-for="(item, index) in dataForm.detail1" :key="index">
              <el-form-item :key="item.key" :label="item.label">  
                {{item.value}}
              </el-form-item>
          </el-col>
        </el-row>

        <el-row style="padding:0  0  0 30px;" >
          <el-col :span="8" v-for="(item, index) in dataForm.detail2" :key="index" >
              <el-form-item :key="item.key" :label="item.label"  >  
                {{item.value}}
              </el-form-item>
          </el-col>
        </el-row>

        <table id="table" border="1" cellspacing="0" style="width:100%;margin:40px 0;border-collapse: collapse" >
            <thead>
            <tr style="height:30px">
                <th  v-for="(item,index) in dataForm.dataTable.tr" :key='index'>{{item.label}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in dataForm.dataTable.data" :key='index' style="text-align:center;height:30px" >
                <td>{{ item.poCode }}</td>
                <td>{{ item.prodCode }}</td>
                <td>{{ item.prodName }}</td>
                <td>{{ item.unitName }}</td>
                <td>{{ item.poQty }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ item.inventoryStatusName }}</td>
                <td>{{ item.remark }}</td>
            </tr>
            </tbody>
        </table>
        <el-row  type="flex" class="row-bg" justify="space-around" style="padding:10px 20px">
          <el-col :span="6"  v-for="(item,index) in dataForm.footer" :key="index">
            <el-form-item :label="item.label"  :key="item.key">
              {{item.value}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="position: absolute; bottom:50px;left:50%;margin-left:-50px;width:100px" >
        <span>第{{ dataForm.currentPage }}页，共{{ dataForm.countPage }}页</span>
      </div>
    </div>
</template>
<script>
// 表格
import erpTable from '@/components/erp-table/table-usually'
import { StringDecoder } from 'string_decoder'
export default {
  components: {
    erpTable
  },
  name: 'storageEditor',
  props: {
    dataForm: {
     type: Object,
     default () {
       return {
        poCode: '',
         title: {
           type: String
         },          // 标题
         compName: {
           type: String
         },       // 公司名称
         dataTable: {
           type: Object
         },     // 表格
         detail1: {
           type: Array
         },
         detail2: {
           type: Array
         },
         currentPage: {
           type: String
         },   // 当前页
         countPage: {
           type: String
         },     // 总页数
         printTime: {
           type: String
         },
         poInstockDetail: {
           type: Object
         }
       }
     }
    }

  },
  methods: {
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
        this.$emit('input', this.dataForm) //用于出发v-model原始事件，避免父级其他监听
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
.title{
  font-size: 20px;
}
.row-bg {
  padding: 10px 0;
}
el-form-item{
  min-width: 36px;
}
.el-col{
  height: 36px;
}
</style>