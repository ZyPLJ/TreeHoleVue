import axios from '../axios'


export const getRecordList = () => {
    return axios({
        url: 'LikeRecord',
        method: 'get',
    })
}
export const addLikeRecord = (data) => {
    return axios({
        url: 'LikeRecord',
        method: 'post',
        data
    })
}
