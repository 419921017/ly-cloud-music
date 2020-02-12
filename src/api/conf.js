import Axios from 'axios';

const baseURL = 'http://localhost:9000'

const axiosInterface = Axios.create({
  baseURL
})

axiosInterface.interceptors.response.use(
  res => res.data,
  err => {
    console.log(err, '网络错误')
  }
)

export {
  axiosInterface
}