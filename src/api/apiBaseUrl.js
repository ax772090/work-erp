
/**
 * 请求地址处理
 * @param {*} ApiBaseUrl action方法名称
 */
export default function ApiBaseUrl () {
  // return process.env.BASE_API;
  // return 'http://www.lvpai520.com';
  // return 'http://192.168.3.242:80';
  // return 'http://192.168.1.83:80';
  // return 'https://www.lvpaiyunyue.com:7443';
  // return 'https://39.104.86.176';
  return process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl
}
