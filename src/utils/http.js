//axios基础的封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import 'element-plus/theme-chalk/el-message.css'

const httpInstance = axios.create({
    baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
    timeout: 5000
})

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
    const useStore = useUserStore()
    const token = useStore.useInfo.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, e => Promise.reject(e))

// axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
    const useStore = useUserStore()
    //统一错误提示
    ElMessage({
        type: 'warning',
        message: e.response.data.message
    })
    // console.log(e);
    //401 token失效处理方法 1.清除本地用户数据 2.跳转到登录页
    if (e.response.status === 401) {
        useStore.clearUseInfo()
        router.push('/login')
    }

    return Promise.reject(e)
})

export default httpInstance