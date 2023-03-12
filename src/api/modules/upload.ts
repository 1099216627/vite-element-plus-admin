import { http } from "../index";
import { ResultData } from "@/api/types";

export function uploadImageApi(file: File) {
	return http.upload<ResultData>(
		{
			url: "/api/v1/upload/image"
		},
		{
			file
		}
	);
}
