//管理用户数据相关
import { loginAPI } from '@/apis/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCartStore } from './cartStore'
import { mergeCartAPI } from '@/apis/cart'

export const useUserStore = defineStore('user', () => {
    const cartStore = useCartStore()
    //1.定义管理用户的数据state
    const useInfo = ref({})
    //2.定义获取接口数据的action函数
    const getUserInfo = async ({ account, password }) => {
        const res = await loginAPI({ account, password })
        useInfo.value = res.result
        //合并购物车的操作
        mergeCartAPI(cartStore.cartList.map(item => {
            return {
                skuId: item.skuId,
                selected: item.selected,
                count: item.count
            }
        }))
        cartStore.updateNewList()
    }
    //退出时清除用户信息
    const clearUseInfo = () => {
        useInfo.value = {}
        //执行清除购物车的action
        cartStore.clearCart()
    }

    //3.以对象格式把state和action return
    return {
        useInfo,
        getUserInfo,
        clearUseInfo
    }
}, {
    persist: true,
})