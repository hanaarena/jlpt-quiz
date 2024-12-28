interface RequestOptions extends RequestInit {
  endpoint: string;
  baseUrl?: string;
}

const BASEURL = process.env.QUIZ_ENDPOINT;

const request = async <T>(options: RequestOptions): Promise<T> => {
  const { endpoint, method = 'GET', headers = {}, body, baseUrl = BASEURL, ...rest } = options;

  const url = `${baseUrl ?? ''}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const fetchOptions: RequestInit = {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorMsg = await response.json();
      throw new Error(`${errorMsg?.message || response.statusText}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};


const get = <T>(endpoint: string, options?: RequestInit): Promise<T> =>
  request<T>({ ...options, endpoint, method: 'GET' });

const post = <T>(endpoint: string, body: any, options?: RequestInit): Promise<T> =>
  request<T>({ ...options, endpoint, method: 'POST', body });

const put = <T>(endpoint: string, body: any, options?: RequestInit): Promise<T> =>
  request<T>({ ...options, endpoint, method: 'PUT', body });

const del = <T>(endpoint: string, options?: RequestInit): Promise<T> =>
  request<T>({ ...options, endpoint, method: 'DELETE' });

export {
  get,
  post,
  put,
  del,
};