import Vue from 'vue'

Vue.filter('splitNumber', function (value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
})
