import Vue from 'vue'

Vue.filter('formatDate', date => {
  const dateAndTime = date.toISOString().split('T')
  const time = dateAndTime[1].split(':')
  return dateAndTime[0] + ' ' + time[0] + ':' + time[1]
})
Vue.filter('splitNumber', function (value) {
  try {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch (error) {
    return value
  }
})
