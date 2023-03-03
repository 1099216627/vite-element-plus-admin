import { http } from "@/api";
import { ResultData } from "@/api/types";
import { RequestEnum } from "@/enums/http-enum";
export function login(data: any) {
	return http.request<ResultData>({
		url: "/api/v1/auth/signin",
		method: RequestEnum.POST,
		data
	});
}
