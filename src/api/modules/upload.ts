import http, { urlPrefix } from "../index";

export const uploadImageApi = (data: FormData) => http.post<string>(urlPrefix + "/upload/image", data);
