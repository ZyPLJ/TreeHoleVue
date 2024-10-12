import axios from '../axios'


export const getList = () => {
    return axios({
        url: 'Comment/GetAll',
        method: 'get',
    })
}

export const addComment = (data) => {
    return axios({
        url: 'Comment',
        method: 'post',
        data
    })
}

export const getApiList = (PageSize = 10,Page = 1) => {
    return axios({
        url: '/Api/Comment',
        method: 'get',
        params: {PageSize,Page}
    })
}
//审核通过
export const acceptComment = (id,data) => {
    return axios({
        url: `/Api/Comment/${id}/Accept/`,
        method: 'post',
        //设置json格式
        headers: {
            'Content-Type': 'application/json'
        },
        data
    })
}
//审核不通过
export const rejectComment = (id,data) => {
    return axios({
        url: `/Api/Comment/${id}/Reject/`,
        method: 'post',
        //设置json格式
        headers: {
            'Content-Type': 'application/json'
        },
        data
    })
}
//删除评论
export const delteComment = (id) =>{
    return axios({
        url:"/Api/Comment/" + id,
        method:'delete',
    })
}
//删除多条评论
export const delteComments = (ids) =>{
    return axios({
        url:"/Api/Comment",
        method:'delete',
        data:ids
    })
}

export const getRankingList = () => {
    return axios({
        url: 'Comment/GetRanking',
        method: 'get',
    })
}
