import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const type = {
  SET_IS_AUTNENTIATED: 'SET_IS_AUTNENTIATED',//是否认证通过
  SET_USER: 'SET_USER' // 用户信息
};

//全局访问的state对象
const state = {
    isAutnenticated:false,//是否认证
    user:{},//存储用户信息
};

//实时监听state值得变化
const getters = {
    isAutnenticated:state => state.isAutnenticated,
    user: state => state.user

};

//自定义改变state初始值的方法
const mutations = {
    //设置SET_IS_AUTNENTIATED类型
    [type.SET_IS_AUTNENTIATED](state, isAutnenticated){
        if (isAutnenticated) {
            state.isAutnenticated = isAutnenticated
        } else{
            state.isAutnenticated = false
        }
    },

    //设置SET_USER类型
    [type.SET_USER](state, user) {
        if (user){
            state.user = user
        } else{
            state.user = {}
        }
    }
};

//触发mutations里的方法
const actions = {
    setisAutnenticated:({ commit }, isAutnenticated) => {
        commit(type.SET_IS_AUTNENTIATED, isAutnenticated)
    },
    setUser: ({ commit }, user) => {
        commit(type.SET_USER, user)
    },
    clearCurrentState: ({ commit }) => {
        commit(type.SET_IS_AUTNENTIATED, false)
        commit(type.SET_USER, null)
    }
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
