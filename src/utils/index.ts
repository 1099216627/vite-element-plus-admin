import { isArray } from "./is";

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

export function setObjToUrlParams(baseUrl: string, obj: any): string {
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
//扁平化对象
export function treeToFloat(data: any[]) {
	const res: any = [];
	const forFn = function (arr: any[]) {
		for (let i = 0; i < arr.length; i++) {
			const item = arr[i];
			res.push(item);
			if (item.children) {
				forFn(item.children);
				delete item.children;
			}
		}
	};
	forFn(data);
	return res;
}

//合并对象
export function mergeObject<T>(obj1: T, obj2: T): T {
	const obj3: any = {};
	for (const attrname in obj1) {
		obj3[attrname] = obj1[attrname];
	}
	for (const attrname in obj2) {
		obj3[attrname] = obj2[attrname];
	}
	return obj3;
}
/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @return string
 * */
export function handleProp(prop: string) {
	const propArr = prop.split(".");
	if (propArr.length == 1) return prop;
	return propArr[propArr.length - 1];
}
/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames 指定 label && value 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @return string
 * */
export function filterEnum(
	callValue: any,
	enumData: any[] | undefined,
	fieldNames?: { label: string; value: string },
	type?: "tag"
): string {
	const value = fieldNames?.value ?? "value";
	const label = fieldNames?.label ?? "label";
	let filterData: { [key: string]: any } = {};
	if (Array.isArray(enumData)) filterData = enumData.find((item: any) => item[value] === callValue);
	if (type == "tag") return filterData?.tagType ? filterData.tagType : "";
	return filterData ? filterData[label] : "--";
}
/**
 * @description 处理无数据情况
 * @param {String} callValue 需要处理的值
 * @return string
 * */
export function formatValue(callValue: any) {
	// 如果当前值为数组,使用 / 拼接（根据需求自定义）
	if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
	return callValue ?? "--";
}
/**
 * @description 处理 prop 为多级嵌套的情况(列如: prop:user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @return any
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
	if (!prop.includes(".")) return row[prop] ?? "--";
	prop.split(".").forEach(item => (row = row[item] ?? "--"));
	return row;
}
