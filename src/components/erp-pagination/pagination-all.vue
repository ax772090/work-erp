<template>
  <div>
    <el-pagination 
      :current-page="pagination.currPage"
      :page-size="pagination.pageSize"
      :total="pagination.totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle">
    </el-pagination>
  </div>
</template>
<script>
/**
 * size-change  pageSize 改变的时候触发
 * current-change
 * current-page
 * page-sizes	每页显示个数选择器的选项设置
 * page-size	每页显示条目个数，支持 .sync 修饰符
 * total	总条目数
 * layout	组件布局，子组件名用逗号分隔
 */
  export default {
    name: 'paginationAll',
    props: {
      value: {default: ''}
      // 触发父的哪个方法
      // paginationChangeHandle: {default: 'getDataList'},
      // 当前页数
      // currPage: {default: 1},
      // 一页显示的条数
      // pageSize: {default: 10},
      // 总页数
      // totalPage: {default: 0},
      // 总条数
      // totalCount: {default: 0},
    },
    data () {
      return {
        pagination: {}
      }
    },
    methods: {

      // 每页数改变时
      sizeChangeHandle (val) {
        this.pagination.pageSize = val
        this.pagination.currPage = 1
        this.$emit('paginationChangeHandle', 1)
      },

      // 当前页改变时
      currentChangeHandle (val) {
        this.pagination.currPage = val
        this.$emit('paginationChangeHandle', val)
      }
    },
    watch: {
      value: {
        handler (val, oldVal) {
          this.pagination = this.value
        },
        deep: true
      },

      pagination: {
        handler (val, oldVal) {
          this.$emit('input', this.pagination)
        },
        deep: true
      }
    }
  }
</script>