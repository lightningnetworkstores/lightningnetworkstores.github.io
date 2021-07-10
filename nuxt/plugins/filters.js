import Vue from 'vue'

Vue.filter('splitNumber', function (value) {
  try {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch (error) {
    return value
  }
})

Vue.filter('capitalize', text => text[0].toUpperCase() + text.slice(1))