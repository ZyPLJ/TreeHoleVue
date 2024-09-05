import vuex from 'vuex'
// 引入子模块
import app from './modules/app'

const store = new vuex.Store({
    modules: {
        app
    }
})

export default store