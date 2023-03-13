// * 生成一个唯一的ID
export function generateUUID() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
/**
 * @description 生成随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @return number
 */
export function randomNum(min: number, max: number): number {
	let num = Math.floor(Math.random() * (min - max) + max);
	return num;
}
// * 数组分组
export function groupArray(arr: any[], field: string) {
	let map = new Map();
	return arr.reduce((acc, cur) => {
		if (!map.has(cur[field])) {
			map.set(cur[field], true);
			acc.push({
				label: cur[field],
				data: [cur]
			});
		} else {
			for (let i = 0; i < acc.length; i++) {
				if (acc[i]["label"] === cur[field]) {
					acc[i].data.push(cur);
					break;
				}
			}
		}
		return acc;
	}, []);
}
