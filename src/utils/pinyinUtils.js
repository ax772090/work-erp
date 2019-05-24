/**
 * 获取汉字的拼音首字母
 * @param str 汉字字符串，如果遇到非汉字则原样返回
 * @param polyphone 是否支持多音字，默认false，如果为true，会返回所有可能的组合数组
 */
export function getFirstLetter(str, polyphone) {
  var pinyin = require('pinyin')
  return pinyin(str, {
    style: pinyin.STYLE_FIRST_LETTER,
    heteronym: pinyin.polyphone               // 启用多音字模式
  }).join('')
}

/**
 * 根据汉字获取拼音，如果不是汉字直接返回原字符
 * @param str 要转换的汉字
 * @param withtone 返回结果是否包含声调，默认是
 * @param polyphone 是否支持多音字，默认否
*/
export function getPinyin(str, splitter, withtone, polyphone) {
  var pinyin = require('pinyin')
  return pinyin(str, {
    heteronym: polyphone,         // 启用多音字
    style: pinyin.STYLE_NORMAL // 设置拼音风格
  }).join('')
}
