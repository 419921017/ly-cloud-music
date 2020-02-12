import { axiosInterface } from './conf';

export const getBannerRequest = () => {
  return axiosInterface.get('/banner')
}

export const getRecommendListRequest = () => {
  return axiosInterface.get('/personalized')
}