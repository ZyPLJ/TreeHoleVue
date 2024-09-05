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

//删除评论
export const delteComment = (id) =>{
    return axios({
        url:"/Api/Comment/" + id,
        method:'delete',
    })
}

