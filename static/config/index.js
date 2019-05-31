/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {}
  // api接口请求地址
  // Zard-周煜森：192.168.1.110:8008
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.8.106:8008/erp-web/'

  // Darren-丁玮楚：192.168.1.106:8080
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.3.108:8080/erp-web/'

  // Edison-瞿育忠：192.168.1.100:8080
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.8.111:8008/erp-web/'

  // kael-刘文勇192.168.1.105:8080
  //  window.SITE_CONFIG['baseUrl'] = 'http://192.168.3.130:8008/erp-web/'

  // Anne-方倩192.168.1.105:8080
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.1.109:8080/erp-web/'

  // Egbert-宋文豪192.168.3.131
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.8.110:8008/erp-web/'

  // 肖德辉
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.8.109:8008/erp-web/'

  // 服务器
   window.SITE_CONFIG['baseUrl'] = 'http://192.168.3.114:8008/erp-web/'
  // window.SITE_CONFIG['baseUrl'] = 'http://erp.substanbo.com:8008/erp-web/'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = '' // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
