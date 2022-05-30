import axios from "axios";

const client = axios.create({ baseURL: " https://api.npms.io/v2" });
export const request = async ({ ...options }) => {
  const onSuccess = (response: any) => {
    return response;
  };
  const onError = (error: string) => {
    return error;
  };

  return client(options).then(onSuccess).catch(onError);
};
