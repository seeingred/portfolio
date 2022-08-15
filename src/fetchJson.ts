export const fetchJson = async (url: RequestInfo, options?: RequestInit | undefined): Promise<any> => {
    return (await fetch(url, options)).json();
};
