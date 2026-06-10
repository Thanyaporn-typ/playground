import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
import condodetail from './condodetail.js'


export default new Vuex.Store({
    modules: {
        condodetail,
    }
})
