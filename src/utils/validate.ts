export const validatePhone = (rule: any, value: string, callback: any) => {
	const { required } = rule;
	if (!required && !value) {
		return callback();
	}
	if (!value) {
		return callback(new Error("请输入手机号"));
	} else {
		const reg = /^1[3|4|5|7|8][0-9]{9}$/;
		if (!reg.test(value)) {
			callback(new Error("请输入正确的手机号"));
		} else {
			callback();
		}
	}
};

export const validateEmail = (rule: any, value: string, callback: any) => {
	const { required } = rule;
	if (!required && !value) {
		return callback();
	}
	if (!value) {
		return callback(new Error("请输入邮箱"));
	} else {
		const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/;
		if (!reg.test(value)) {
			callback(new Error("请输入正确的邮箱"));
		} else {
			callback();
		}
	}
};

export const validatePassword = (rule: any, value: string, callback: any) => {
	if (!value) {
		return callback(new Error("请输入密码"));
	} else {
		const reg =
			/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]/;
		if (!reg.test(value)) {
			callback(new Error("请输入6-16位数字、字母和特殊符号组合的密码"));
		}
		callback();
	}
};
export const validateUsername = (rule: any, value: string, callback: any) => {
	const { required } = rule;
	if (!required && !value) {
		return callback();
	}
	if (!value) {
		return callback(new Error("请输入用户名"));
	} else {
		const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
		if (!reg.test(value)) {
			callback(new Error("请输入6-16位数字和字母组合的用户名"));
		} else {
			callback();
		}
	}
};

export const validateNickname = (rule: any, value: string, callback: any) => {
	const { required } = rule;
	if (!required && !value) {
		return callback();
	}
	if (!value) {
		return callback(new Error("请输入昵称"));
	} else {
		const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,16}$/;
		if (!reg.test(value)) {
			callback(new Error("请输入2-16位长度的昵称"));
		} else {
			callback();
		}
	}
};
export const validateUrl = (rule: any, value: string, callback: any) => {
	const { required } = rule;
	if (!required && !value) {
		return callback();
	}
	if (!value) {
		return callback(new Error("请输入网址"));
	} else {
		const reg = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/;
		if (!reg.test(value)) {
			callback(new Error("请输入正确的网址"));
		} else {
			callback();
		}
	}
};
