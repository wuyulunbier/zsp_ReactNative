import axios from 'axios';
import qs from 'querystring';
import API from '../Request/API'
import md5 from 'md5';
import { Platform} from 'react-native';

import {UserInfo,DeviceInfo} from '../.././global'
// import { userInfo } from 'os';

axios.defaults.baseURL = API.testURL;
axios.defaults.timeout = 60000;

function outputObj(obj) {
    var description = "";
    for (var i in obj) {
        description += i + " = " + obj[i] + "\n";
    }
    return description;
}

function sign(params, token) {
    let appKey = 'oQIhAP24Kb3Bsf7IE14wpl751bQc9VAPsFZ+LdB4riBgg2TDAiEAsSomOO1v8mK2VWhEQh6mttgN';
    let keys = Object.keys(params).sort();
    let arr = [];
    for (let index in keys) {
        arr.push((keys[index] + '=' + params[keys[index]]));
    }
    let sign = md5((appKey + token + arr.join('|'))).toUpperCase();
    return sign;
}

axios.interceptors.request.use(config => {

    let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS==='android'?'android':'h5';
    
    // storage.load({key: 'deviceinfo'}).then(ret => {
           
    //     deviceId = ret.id;
        
    // }).catch((err) => {
        
    // });
    // config.headers['VERSION'] = 'V1.0';


    if(UserInfo.token){
         config.headers['Authorization'] = UserInfo.token;
    }
      config.headers['Content-Type']='application/json';

      if(UserInfo.deviceId){
        config.headers['X-ID']=UserInfo.deviceId;
      }
    //  config.headers['X-ID']='20190609120013_b294565b88d8452b95ad15b98e01ec5b';
      config.headers['X-Platform']=software_platform
    // if(config.method === 'get'){
    //     config.params = {
    //         ...config.data,
    //         _t: Date.parse(new Date())/1000
    //     }
    // }
    return config;
});

axios.interceptors.response.use(response => {
    console.log(response);
    return response;
    // if (response.data.status_code === '200' || response.data.status_code === 200) {
    //     return response.data.data || response.data;
    // } else {
    //     throw Error(response.data.data.Message || '服务异常');
    // }
});

export default class Http {
    static async get(url, params) {
        try {
            let query = await qs.stringify(params);
            
            let res = null;
              
            if (!params) {
                res = await axios.get(url);
            } else {
                res = await axios.get(url + '?' + query);
            }
            return res;
        } catch (error) {
            return error;
        }
    }

    static async post(url,params) {
        try {
            let res = await axios.post(url,params);
            return res;
        } catch (error) {
            return error;
        }
    }

    static async patch(url, params) {
        try {
            let res = await axios.patch(url, params);
            return res
        } catch (error) {
            return error;
        }
    }

    static async put(url, params) {
        try {
            let res = await axios.put(url, params);
            return res;
        } catch (error) {
            return error;
        }
    }

    static async delete(url, params) {
        try {
            let res = await axios.post(url, params);
            return res;
        } catch (error) {
            return error;
        }
    }
}
