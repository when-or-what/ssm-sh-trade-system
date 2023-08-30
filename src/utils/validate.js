// 用户名校验
// 2-12位由中文、英文、数字、下划线组成的字符串 
export const usernameValid = (val) => /^[\u4E00-\u9FA5A-Za-z0-9_]{2,12}$/g.test(val);

// 密码校验
// 4-15位由英文、数字、下划线(_)和特殊字符(@#$%.)组成的字符串
export const passwordValid = (val) => /^[A-Za-z0-9_@#$%.]{4,15}$/g.test(val);

// 邮箱校验
// 合法的邮箱即可
export const emailValid = (val) => /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/g.test(val);

// 电话号码校验
// 合法的11位电话号码即可
export const phoneValid = (val) => /^1[3-9]\d{9}$/g.test(val);

// 联系方式校验
// 0-40位由中文、英文、数字、下划线组成的字符串 
export const userContactValid = (val) => /^[\u4E00-\u9FA5A-Za-z0-9_]{0,40}$/g.test(val);


// 用户简介校验
// 0-200位由中文、英文、数字、下划线组成的字符串 
export const userRemarkValid = (val) => /^[\u4E00-\u9FA5A-Za-z0-9_]{0,200}$/g.test(val);


// 验证码校验
// 6位由数字和52个英文字母组成的字符串
export const vcodeValid = (val) => /^[0-9A-Za-z]{6}$/g.test(val);