export function is(value: any, type: string) {
	return Object.prototype.toString.call(value) === `[object ${type}]`;
}

export function isFunction(value: any) {
	return is(value, "Function");
}

export function isString(value: any) {
	return is(value, "String");
}

export function isNumber(value: any) {
	return is(value, "Number");
}

export function isObject(value: any) {
	return is(value, "Object");
}

export function isUrl(path: string) {
	const reg = /^(https?:|mailto:|tel:)/;
	return reg.test(path);
}

export function isExternal(path: string) {
	return /^(https?:|mailto:|tel:)/.test(path);
}

export function isArray(value: any) {
	return is(value, "Array");
}
