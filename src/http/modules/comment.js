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