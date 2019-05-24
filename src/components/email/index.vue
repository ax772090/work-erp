<!-- 
第一句话没有规律,确定的只有'明细如下:'
合计无规律
 -->
<template>
  <div class="email">
    <div class="recipients">Hi {{emailData.recipients}}</div>
    <div>以下{{emailData.title}}将于{{emailData.date}}到货{{emailData.number}},明细如下:</div>
    <table class="gridtable">
      <tr>
        <th v-for="(element, index) in emailData.headerData"
          :key="index">{{element.nameCn}}</th>
      </tr>
      <tr v-for="(item, index) in emailData.table"
          :key="index">
        <td v-for="(element, index) in emailData.headerData"
          :key="index">{{item[element.nameE]}}</td>
      </tr>
    </table>
    <div class="footnoteText">{{emailData.footnoteText}}</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      emailData: {
        recipients: 'All',
        title: '采购订单',
        date: '2019年03月14日',
        number: '3954件',
        total: '123个',
        footnoteText: '请采购提前通知供应商确认到货信息，如有延迟请及时通知销售。请销售提前安排发货计划。',
        headerData: [{
          nameE: 'contract',
          nameCn: '采购合同号'
        }, {
          nameE: 'prodName',
          nameCn: '产品名称'
        }, {
          nameE: 'channel',
          nameCn: '备货渠道'
        }, {
          nameE: 'specification',
          nameCn: '规格'
        }, {
          nameE: 'buyNumber',
          nameCn: '采购数量'
        }],
        table: [{
          contract: '1',
          prodName: '1洗牙器',
          channel: '1北京',
          specification: '1个',
          buyNumber: '14658'
        }, {
          contract: '2',
          prodName: '2洗牙器',
          channel: '2北京',
          specification: '2个',
          buyNumber: '24658'
        }, {
          contract: '',
          prodName: '',
          channel: '',
          specification: 'Sum',
          buyNumber: '24658'
        }]
      }
    }
  }
}
</script>
<style scoped>
.email{
  font-size: 16px
}
.recipients{
  margin-bottom: 30px
}
table.gridtable {
  min-width: 500px;
  margin-top: 10px;
  margin-bottom: 20px;
  font-family: verdana, arial, sans-serif;
  font-size: 14px;
  color: #333333;
  border-width: 1px;
  border-color: #666666;
  border-collapse: collapse;
}
table.gridtable th {
  font-size: 14px;
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #666666;
  background-color: #dedede;
}
table.gridtable td {
  font-size: 12px;
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #666666;
  background-color: #ffffff;
}
</style>
