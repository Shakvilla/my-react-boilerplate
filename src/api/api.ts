// import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import axios, { AxiosInstance, Cancel, AxiosPromise } from 'axios'

import {
  ApiRequestConfig, 
  WithAbortFn, 
  ApiExecutor, 
  ApiExecutorArgs, 
  ApiError
} from './api.types'

const axiosParams = {


  //Set different base URL based on the environment

  baseURL :
   process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '/'
}


// Create axios instance with default params
const axiosInstance = axios.create(axiosParams)


//Main api function

export const didAbort = (
  error: unknown
  ) : error is Cancel & {aborted: boolean} => axios.isCancel(error)

const getCancelSource = () => axios.CancelToken.source()

export const isApiError = (error: unknown) : error is ApiError => {

  return axios.isAxiosError(error)

}

const withAbort = <T>(fn: WithAbortFn) => {
  const executor : ApiExecutor<T> = async (...args: ApiExecutorArgs) => {

    const originalConfig = args[args.length - 1 ] as ApiRequestConfig

    const {abort, ...config} = originalConfig

    if(typeof abort === 'function'){
      const { cancel, token} = getCancelSource()
      config.cancelToken = token
      abort(cancel)
    }

    try {

      if (args.length > 2) {

        const [url, body] = args
        return await fn<T>(url, body, config)

      }else {

        const [url] = args

        return await fn<T>(url, config)
      }
    } catch (error) {

      console.log('api error', error)

      if(didAbort(error)){
        error.aborted = true
      }

      throw error
    }
  }

  return executor
}


const withLogger = async <T>(promise: AxiosPromise<T>) => 
  promise.catch((error: ApiError) => {

    if(!process.env.REACT_APP_DEBUG_API) throw error

    if(error.response) {
      console.log(error.response.data)
      console.log(error.response.status) 
      console.log(error.response.headers)
    } else if(error.request){
      //The request was made but no response was received
      //`error.reques` is an instance of XMLHttoReques
      // in the browser and an instance of
      // http.ClientRequest in nodejs
      console.log(error.request)
    }else{
      console.log('Error', error.message)
    }
    console.log(error.config)

    throw error
  })



//Main api function
const api = (axios: AxiosInstance) => { 
  return {
    get: <T>(url: string, config: ApiRequestConfig = {}) =>
      withLogger<T>(withAbort<T>(axios.get)(url, config)),

    delete: <T>(url: string, config: ApiRequestConfig) =>
      withLogger<T>(withAbort<T>(axios.delete)(url, config)),

    post: <T>(url: string, body: unknown, config: ApiRequestConfig) =>
      withLogger<T>(withAbort<T>(axios.post)(url, body, config)),

    patch: <T>(url: string, body: unknown, config: ApiRequestConfig) =>
      withLogger<T>(withAbort<T>(axios.patch)(url, body, config)),

    put: <T>(url: string, body: unknown, config: ApiRequestConfig) =>
      withLogger<T>(withAbort<T>(axios.put)(url, body, config)),
  }
};

export default api(axiosInstance);