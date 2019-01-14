import axios from 'axios';
import {Message  , Loading } from 'element-ui';
import router from './router'

let loading;   //定义loading变量

//使用Element  Loading-start 方法
function startLoaing (){
	loading = Loading.service({
		lock: true,
		text: '加载中...',
		background: 'rgba(0, 0, 0, 0.7)'
	});
}

//使用Element  Loading-start 方法
function endLoading (){
	loading.close();
}



//请求拦截
axios.interceptors.request.use(
	config => {
		//加载动画
		startLoaing();
		if(localStorage.eleToken){
			//设置统一的请求头 header
			config.headers.Authorization = localStorage.eleToken;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);


//响应拦截
axios.interceptors.response.use(
	response => {
		//结束加载动画
		endLoading();
		return response;
	},
	error =>{
		//消息提示
        endLoading();
		Message.error(error.response.data);
		//获取错误状态码
		const { status } = error.response;
		if(status == 404){
			Message.error("Token失效，请重新登录！");
            //清除token
            localStorage.removeItem('eleToken');
		}

		//跳转到登录页面
		router.push('/login');

		//返回错误信息
		return Promise.reject(error);
	}
);







export default axios