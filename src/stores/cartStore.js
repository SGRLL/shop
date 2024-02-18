//封装购物车模块
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { insertCartAPI, findNewListAPI, delCartAPI } from '@/apis/cart'

export const useCartStore = defineStore('cart', () => {
    const userStore = useUserStore()
    const isLogin = computed(() => userStore.useInfo.token)
    const cartList = ref([])
    //获取最新购物车列表action
    const updateNewList = async () => {
        const res = await findNewListAPI()
        //用接口购物车覆盖本地购物车列表
        cartList.value = res.result
    }

    //添加购物车
    const addCart = async (goods) => {
        const { skuId, count } = goods
        if (isLogin.value) {
            //登录时调用接口
            //判断登录之后加入购物车逻辑
            await insertCartAPI({ skuId, count })
            updateNewList()
        } else {
            //非登录是操作本地
            //添加购物车操作
            //匹配传递过来商品对象的skuid能不能在cartList找到，找到就是添加过count++，没有就添加进去
            const item = cartList.value.find((item) => goods.skuId === item.skuId)
            if (item) {
                item.count++
            } else {
                cartList.value.push(goods)
            }
        }
    }
    //删除购物车
    const delCart = async (skuId) => {
        if (isLogin.value) {
            //调用接口实现接口购物车中的删除功能
            await delCartAPI([skuId])
            updateNewList()
        } else {
            //找到删除项的下标值 -splice
            const idx = cartList.value.findIndex((item) => skuId === item)
            cartList.value.splice(idx, 1)
        }
    }
    //清除购物车
    const clearCart = () => {
        cartList.value = []
    }


    //单选功能
    const singleCheck = (skuId, selected) => {
        //通过skuId匹配要修改的那一项 然后把他的selected修改为传过来的selected
        const item = cartList.value.find((item) => item.skuId === skuId)
        item.selected = selected
    }

    //全选功能
    const allCheck = (selected) => {
        //把cartList中的每一项selected都设置为当前的全选框状态
        cartList.value.forEach(item => item.selected = selected)
    }

    //所有数量之和
    const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
    //总价
    const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))
    //已选择数量
    const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
    //已选择价格合计
    const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))

    //判断是否全选
    const isAll = computed(() => cartList.value.every((item) => item.selected))


    return {
        cartList,
        addCart,
        delCart,
        allCount,
        allPrice,
        singleCheck,
        isAll,
        allCheck,
        selectedCount,
        selectedPrice,
        clearCart,
        updateNewList
    }
}, {
    persist: true,
})