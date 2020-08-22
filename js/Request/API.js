// const baseURL = 'http://120.27.212.187';
const baseURL = 'https://cdf.oywj.cn';
const testURL = 'https://cdf.oywj.cn/dsh/'

export default {
    testURL,
    baseURL,
    getToken: baseURL + '/app/GetToken/',
    register: baseURL + '/user/Register/',
    login: baseURL + '/user/Login/',
    getVerifyCode: baseURL + '/user/GetVerifyCode/',
    modifyPwCode: baseURL + '/user/ModifyPwCode/',
    mixture: baseURL + '/loan/mixture/',
    product: baseURL + '/loan/product/',
};
