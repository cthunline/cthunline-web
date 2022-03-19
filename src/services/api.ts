import Axios, { AxiosRequestHeaders } from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiCallOptions {
    method: HttpMethod;
    route: string;
    data?: object | FormData;
    progress?: (percent: number) => void
}

const Api = {

    baseUrl: String(import.meta.env.VITE_API_URL),

    async call({
        method,
        route,
        data,
        progress
    }: ApiCallOptions) {
        if (!Api.baseUrl) {
            throw new Error('Unavailable base URL');
        }
        const url = `${Api.baseUrl}${route}`;
        const headers: AxiosRequestHeaders = data instanceof FormData ? {} : {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };
        const response = await Axios({
            withCredentials: true,
            method,
            url,
            headers,
            data,
            onUploadProgress: progress ? (
                (progressEvent) => {
                    progress(
                        Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                    );
                }
            ) : undefined
        });
        return response.data;
    },

    getAssetUrl: (path: string) => (
        new URL(
            `/static/${path}`,
            Api.baseUrl
        ).href
    )

};

export default Api;
