import Vue from 'vue'

const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
const PROTOCOL_REGEX = /(http:\/\/|https:\/\/)/
const TAGGED_REGEX = /@\w*/g

const prefixHttp = link =>
  PROTOCOL_REGEX.exec(link) ? link : `http://${link}`

Vue.filter('formatDate', date => {
  const dateAndTime = date.toISOString().split('T')
  const time = dateAndTime[1].split(':')
  return dateAndTime[0] + ' ' + time[0] + ':' + time[1]
})
Vue.filter('toHtml', text => {
  return text.replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(URL_REGEX, match => `<a href='${prefixHttp(match)}'>${match}</a>`)
  .split('\n').map(p => `<p>${p}</p>`).join('')
})
Vue.filter('tagUser', text => {
  return text.replace(
    TAGGED_REGEX,
    match => `<span class='user-tag'>${match}</span>`
  )
})
Vue.filter('splitNumber', function (value) {
  try {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch (error) {
    return value
  }
})

Vue.filter('capitalize', text => text[0].toUpperCase() + text.slice(1))