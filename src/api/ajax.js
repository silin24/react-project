import axios from 'axios'
import qs from 'querystring'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '../redux/store'
import {message} from 'antd';
const instance = axios.create();

instance.interceptors.request.use((config)=>{
  NProgress.start()
   //从redux中获取之前所保存的token
   const {token} = store.getState().userInfo
   //向请求头中添加token，用于校验身份
   if(token) config.headers.Authorization = 'atguigu_' + token
   //从配置对象中获取method和data
   const {method,data} = config
   //若是post请求
   if(method.toLowerCase() === 'post'){
     //若传递过来的参数是对象，转换成urlencoded形式
     if(data instanceof Object){
       config.data = qs.stringify(data)
     }
   }
  return config
})
instance.interceptors.response.use(
  (response)=>{
    NProgress.done()
    return response.data
  },
  (error)=>{
    NProgress.done()
    if(error.response.status === 401){
      message.error('身份校验失败，请重新登录',1)
      //分发一个删除用户信息的action
      // store.dispatch(createDeleteUserInfoAction())
    }else{
      //请求若失败，提示错误（这里可以处理所有请求的异常）
      message.error(error.message,1)
    }
    return new Promise(()=>{})
  }
)

export default instance