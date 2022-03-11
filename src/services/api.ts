class FetchError extends Error {
    status: number;
    data: object | null;

    constructor(json: Record<string, any>) {
        super(json.error);
        this.status = json.code;
        this.data = json.data ?? null;
    }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiCallOptions {
    method: HttpMethod;
    route: string;
    body?: object;
    formData?: FormData;
    bearer?: string | null;
}

const Api = {

    baseUrl: import.meta.env.VITE_API_URL,
    bearer: null,

    async call({
        method,
        route,
        body,
        formData,
        bearer
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
        const contentHeaders: object = formData ? {} : {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };
        let bodyData;
        if (body) {
            bodyData = JSON.stringify(body);
        } else if (formData) {
            bodyData = formData;
        }
        const response = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${headerBearer}`,
                ...contentHeaders
            },
            body: bodyData
        });
        if (response.ok) {
            return response.json();
        }
        const json = await response.json();
        throw new FetchError(json);
    }

};

export default Api;
