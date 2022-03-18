import Axios from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiCallOptions {
    bearer?: string | null;
    method: HttpMethod;
    route: string;
    data?: object | FormData;
    progress?: (percent: number) => void
}

const Api = {

    baseUrl: String(import.meta.env.VITE_API_URL),
    bearer: null,

    async call({
        bearer,
        method,
        route,
        data,
        progress
    }: ApiCallOptions) {
        if (!Api.baseUrl) {
            throw new Error('Unavailable base URL');
        }
        const url = `${Api.baseUrl}${route}`;
        let headerBearer = '';
        if (bearer) {
            headerBearer = bearer;
        } else if (Api.bearer) {
            headerBearer = Api.bearer;
        }
        const contentHeaders: object = data instanceof FormData ? {} : {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };
        const response = await Axios({
            method,
            url,
            headers: {
                Authorization: `Bearer ${headerBearer}`,
                ...contentHeaders
            },
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
