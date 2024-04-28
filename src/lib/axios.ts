import axios from "axios"

const baseUri = "http://localhost:8088"

export const apiClient = axios.create({
    baseURL: baseUri
})

export function apiClientWithToken(token?: string) {
    let accessToken: string | undefined = token
    if (!token) {
        accessToken = ""
    }
    apiClient.interceptors.request.use(
        (config)=> {
            if (!config.headers['Authorization'] && token) {
                config.headers['Authorization'] = `Bearer ${accessToken}`
            }
            console.log(config.headers)
            return config
        }
    )
    return apiClient;
}
