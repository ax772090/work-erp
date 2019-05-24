<template>
  <div>
    <template :table="table">
      <el-table :border="table.border"
                :data="table.data"
                :stripe='table.stripe'
                :max-height='table.maxHeight'
                :show-summary="table.hasShowSummary"
                :span-method="objectSpanMethod"
                :summary-method="table.getSummaries"
                :row-class-name="tableRowClassName"
                @row-click="rowClick"
                @selection-change="handleSelectionChange"
                ref="erpTable"
                tooltip-effect="dark"
                v-bind="$props"
                v-loading="table.dataListLoading">
        <!-- 复选框 -->
        <el-table-column type="selection"
                         v-if="table.hasSelect"
                         header-align="center"
                         align="center"
                         width="50"></el-table-column>
        <!-- 展开 -->
        <el-table-column label="展开"
                         type="expand"
                         v-if="table.hasExpand"
                         width="50"
                         header-align="center"
                         align="center">
          <template slot-scope="scope">
            <slot :name="expend"></slot>
            <!-- <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item :label="item.label" v-for="item in table.expands" :key="item.id">
                                <span>{{ scope.row[item.prop] }}</span>
                            </el-form-item>
            </el-form>-->
          </template>
        </el-table-column>
        <!-- table -->
        <template v-for="(item,index) in table.tr">
          <!-- 自定义模板列 -->
          <el-table-column :class-name="item.className ? item.className : ''"
                           :key="index"
                           :label="item.label"
                           :min-width="item.minWidth ? item.minWidth : ''"
                           :sortable="item.sortable? true:false "
                           :width="item.width ? item.width : ''"
                           show-overflow-tooltip
                           v-if="item.show !== false && item.show === 'template'">
            <template slot-scope="scope">
              <slot :name="item.prop"
                    :obj='scope'></slot>
            </template>
          </el-table-column>
          <!-- 正常列 -->
          <el-table-column :class-name="item.className ? item.className : ''"
                           :key="index"
                           :label="item.label"
                           :min-width="item.minWidth ? item.minWidth : ''"
                           :prop="item.prop"
                           :sortable="item.sortable? true:false "
                           :width="item.width ? item.width : ''"
                           show-overflow-tooltip
                           v-else-if="item.show !== false && item.show !== 'template'"></el-table-column>
        </template>
        <!-- 操作列 -->
        <el-table-column :class-name="table.operation.className"
                         :label="table.operation.label"
                         :width="table.operation.width ? table.operation.width : ''"
                         fixed="right"
                         v-if="table.hasOperation">
          <!-- <template slot-scope="scope">
                        <el-button v-for="item in table.operation.data" :class="item.classname ? item.classname : ''" :key="item.id" :size="item.size" @click.stop="handleOperation(scope.$index, scope.row, item.id)">{{ item.label }}</el-button>
          </template>-->
          <template slot-scope="scope">
            <erp-dropdown :dropDownData='table.operation'></erp-dropdown>
            <!-- <el-dropdown :show-timeout="20" @command="handleCommand">
              <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="item.disabled"
                  :key="item.id"
                  @click.native="handleOperation(scope.$index, scope.row, scope.row.id)"
                  command="item.command"
                  v-for="(item,index) in table.operation.data"
                  v-if="item.isShow"
                >{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
 
<script>
// import { table } from 'element-ui'//继承elementui原生table组件
// 表头处理
// import { renderHeaderUtil } from '@/utils/index.js'
// 下拉操作列
import ErpDropdown from './erp-dropdown'
export default {
  name: 'recordlist',
  components: {
    ErpDropdown
  },
  props: {
    // ...table.props,
    table: {
      type: Object,
      default () {
        return {
          maxHeight: '500',
          hasMergeRowOrColumn: false, // 是否合并单元格
          dataListLoading: false, // 加载中动画
          hasShowSummary: false, // 是否显示表位合计行
          border: true, // 是否带有纵向边框，默认为false
          stripe: false, // 创建带斑马纹的表格,默认false
          hasSelect: false, // 有无复选框选中功能
          hasExpand: false, // 有无展开行功能
          hasOperation: false, // 有无操作功能
          tr: [
            // 表头数据 —— className:列的class名
            {
              id: '1',
              label: 'label',
              prop: 'prop',
              className: 'classname',
              minWidth: '80',
              show: true // show有三种值：false隐藏当前列，true常规表格列，template自定义表格列
              //          <template slot-scope="props" slot="example">
              //                <a class="list-a" target="_blank" :href="'/#/bombscreen?mobile=' + props.obj.row.mobile">{{ props.obj.row.username }}</a>
              //          </template>
            }
          ],
          data: [], // 表格数据 —— 如需添加行class，处理数据时则需要传入class名， class需为数组
          operation: {
            // 操作功能
            label: '操作', // 操作列的行首文字
            width: '80', // 操作列的宽度
            className: '', // 操作列的class名
            data: [
              // 操作列数据
              {
                id: '1', // 按钮循环组件的key值
                label: '操作', // 按钮文字
                command: '',
                Fun: 'handleSubmit', // 点击按钮后触发的父组件事件
                isShow: 'true', // 是否显示
                disabled: false, // 是否可用
                classname: 'show' // 按钮的类名
              }
              // {
              //     label: '通过',                // 按钮文字
              //     Fun: 'handleSubmit',         // 点击按钮后触发的父组件事件
              //     size: 'mini',                // 按钮大小
              //     id: '1',                     // 按钮循环组件的key值
              //     classname: 'show'            // 按钮的类名
              // }
            ]
          },
          expands: [
            // 展开行数据
            {
              id: '1',
              label: 'label',
              prop: 'prop'
            }
          ],
          getSummaries (param) {
            // 自定义表位合计行数据
            // *** 此函数传入param参数
            // *** 最后返回一个数组，合计行会显示数组中的内容
            return []
          }
        }
      }
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      }
      return ''
    },
    //   下拉操作列
    handleCommand (command) {
      this.$emit(command.func)
    },
    // 表头内容过长处理
    // renderHeader(h, g) {
    //   return renderHeaderUtil(h, g)
    // },
    handleSelectionChange (val) {
      this.$emit('onHandleSelectionChange', val)
    },
    handleOperation (a, b, id) {
      // Todo
      const data = this.table.operation.data
      for (let i = 0; i < data.length; i++) {
        // if (id === data[i].id) {
        this.$emit(data[i].Fun, a, b)
        // }
      }
    },
    // span-method方法可以实现合并行或列，方法的参数是一个对象，里面包含当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (!this.hasMergeRowOrColumn) {
      } else {
        this.$emit('onMergeRowOrColumn', { row, column, rowIndex, columnIndex })
      }
    },
    // 点击某一行时触发的函数
    // *** 按下左键然后移动鼠标到其它列放开左键，会有报错 -- 优化：添加点击行参数，
    rowClick (Row, Event, Column) {
      if (
        !Column ||
        Column.type === 'selection' ||
        Column.columnKey === 'operation' ||
        Column.type === 'expand'
      ) {
        return
      }
      const data = {
        row: Row,
        event: Event,
        column: Column
      }
      this.$emit('onRowClick', data)
    }
    // 行类名的回调函数
    // 在表格数据中添加class字段即为表格行类名，配合css可对表格行中的自定义标签进行样式优化
    // rowClassName(rowdata) {
    //     const data = this.table.data;
    //     let className = data[rowdata.rowIndex].class ? data[rowdata.rowIndex].class : '';
    //     if (className.length === 0) {
    //         return
    //     }
    //     className = className.join(' ');
    //     return className
    // }
  }
}
</script>
