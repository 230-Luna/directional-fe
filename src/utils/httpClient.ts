import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

interface HttpClient extends AxiosInstance {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T>
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T>
}

const config: AxiosRequestConfig = {
  baseURL: 'https://fe-hiring-rest-api.vercel.app',
  headers: {}
}

const fetchLoginToken = async () => {
  const {
    data: { token }
  } = await axios.post<{ token: string }>(
    'https://fe-hiring-rest-api.vercel.app/auth/login',
    {
      email: import.meta.env.VITE_EMAIL,
      password: import.meta.env.VITE_PASSWORD
    }
  )
  return token
}

const createHttpClient = () => {
  const axiosInstance = axios.create(config)

  axiosInstance.interceptors.request.use(
    config => {
      const loginToken = localStorage.getItem('login_token')

      if (loginToken != null && config.headers != null) {
        config.headers.Authorization = `Bearer ${loginToken}`
      }

      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    response => response.data,
    async error => {
      if (error.response?.status === 401) {
        const token = await fetchLoginToken()
        localStorage.setItem('login_token', token)
        return axios(error.config)
      }

      return Promise.reject(error)
    }
  )

  return axiosInstance
}

export const httpClient: HttpClient = createHttpClient()
