//获取订单详情的接口
import request from '@/utils/http'

export const getOrderAPI = (id) => {
    return request({
        url: `/member/order/${id}`,
    })
}