export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== "object") {
		return obj;
	}
	const result: any = Array.isArray(obj) ? [] : {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			result[key] = deepClone(obj[key]);
		}
	}
	return result;
}

export function setObjToUrlParams(baseUrl: string, obj: object): string {
	let parameters = "";
	let url = "";
	for (const key in obj) {
		parameters += key + "=" + encodeURIComponent(obj[key]) + "&";
	}
	parameters = parameters.replace(/&$/, "");
	if (/\?$/.test(baseUrl)) {
		url = baseUrl + parameters;
	} else {
		url = baseUrl.replace(/\/?$/, "?") + parameters;
	}
	return url;
}
//关系型对象转树形对象
export function floatToTree(data: any[], id = "id", pid = "pid") {
	const res: any = [];
	const temp: any = {};
	for (let i = 0; i < data.length; i++) {
		temp[data[i][id]] = data[i];
	}
	for (let j = 0; j < data.length; j++) {
		const aVal = data[j];
		const parent = temp[aVal[pid]];
		if (parent) {
			(parent.children || (parent.children = [])).push(aVal);
		} else {
			res.push(aVal);
		}
	}
	return res;
}
