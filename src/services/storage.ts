export default {
    set(key: string, data: any) {
        const json = JSON.stringify(data);
        localStorage.setItem(key, json);
    },

    get(key: string) {
        const json = localStorage.getItem(key);
        return json ? JSON.parse(json) : null;
    },

    delete(key: string) {
        localStorage.removeItem(key);
    }
};
