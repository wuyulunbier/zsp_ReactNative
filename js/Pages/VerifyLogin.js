import React, { Component } from 'react'
import { SafeAreaView, BackHandler, Alert, DeviceEventEmitter, KeyboardAvoidingView, ScrollView, Text, TextInput, Platform, TouchableOpacity, View } from 'react-native'
import { Http, API } from "../Request";
import Toast from "react-native-root-toast";
import Spinner from 'react-native-loading-spinner-overlay';
import UserInfo from "../../global/UserInfo";
import { px2dp } from "../../global/Utils";
import Axios from 'axios';
import DeviceInfo from '../../global/DeviceInfo';


export default class VerifyLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            mobileNum: '',
            smsCode: '',
            disabled: false,
            text: '获取验证码',
            color: '#6D8DF4',
            second: 60,
            deviceId: '',
            currentID: ''
        };
    };

    componentWillMount() {
        if (Platform.OS === 'android') {
            this.listener = BackHandler.addEventListener('hardwareBackPress', function () {
                return true;
            });
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            this.listener.remove('hardwareBackPress');
        }
        this.timer && clearInterval(this.timer);
    }

    componentDidMount() {


        // storage.load({key: 'deviceinfo'}).then(ret => {
        //     this.state.deviceId = ret.id;

        // }).catch((err) => {

        // });
    }

    _changeMobile = (input) => {
        this.setState({
            mobileNum: input
        });
    };

    _onPressCode = () => {

        if (this.state.mobileNum.length < 11) {
            Toast.show('请输入正确的手机号码', {
                position: Toast.positions.CENTER,
            });
            return;
        }

        let params = {
            mobile: this.state.mobileNum,
        };


        //获取验证码接口 调试通过
        let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';

        if (UserInfo.deviceId) {
            // 获取验证码
            Http.post(API.testURL + 'auth/code', params).then((res) => {
                setTimeout(() => {
                    this.setState({
                        refreshing: false,
                    });
                }, 1000);

                var message = JSON.stringify(res.data);
                if (res.data.msg === '发送成功') {
                    this.setState({
                        disabled: true,
                        text: this.state.second.toString() + '秒后重发',
                        color: 'gray'
                    });
                    this.timer = setInterval(() => this._tick(), 1000);

                } else {
                    Toast.show(res.data.msg, {
                        position: Toast.positions.CENTER,
                    });
                    return;
                }
            }).catch((err) => {
                setTimeout(() => {
                    this.setState({
                        refreshing: false,
                    });
                }, 1000);
            });

        } else {

            let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
            Axios.get(API.testURL + 'id', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Platform': software_platform
                }
            }).then((response) => {

                UserInfo.deviceId = response.data.data.id;
                DeviceInfo.deviceId = response.data.data.id;
                storage.save({
                    key: 'deviceinfo',
                    data: {
                        deviceId: DeviceInfo.deviceId
                    },
                });
                this.currentID = response.data.data.id;
                this._onPressCode();

            })

        }
    };

    _tick() {
        let current = this.state.second - 1;
        if (current === 0) {
            this.timer && clearInterval(this.timer);
            this.setState({
                disabled: false,
                text: '获取验证码',
                color: '#FF3648',
                second: 60
            });
        } else {
            this.setState({
                text: current.toString() + '秒后重发',
                color: 'gray',
                second: current
            });
        }
    }

    _smsCodeChange = (input) => {
        this.setState({
            smsCode: input
        });
    };

    _onPressVerifyLogin = () => {

        let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
        if (this.state.mobileNum.length < 11 || this.state.smsCode.length < 4) {
            Toast.show('信息输入有误', {
                position: Toast.positions.CENTER,
            });
            return;
        }
        let params = {
            mobile: this.state.mobileNum,
            code: this.state.smsCode,
        };
        //验证码登录
        Http.post(API.testURL + 'auth/login', params).then((res) => {
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                    // spinner: true,
                });
            }, 1000);

            if (res.data.msg === '登录成功') {
                UserInfo.mobileNum = this.state.mobileNum;
                UserInfo.isLogined = true;
                UserInfo.token = res.data.data.token;


                storage.save({
                    key: 'userinfo',
                    data: {
                        token: UserInfo.token,
                        mobileNum: this.state.mobileNum,
                        isLogined: true,
                    },
                });

                //校验是否申请
                // alert(UserInfo.token);  

                Http.get(API.testURL + 'auth/info').then((res) => {


                    Toast.show('登录成功', {
                        position: Toast.positions.CENTER,
                        onHidden: () => {

                            if (this.props.navigation.getParam('callBack') !== undefined) {

                                this.props.navigation.getParam('callBack')();

                            }

                            if (res.data.data.applied !== true) {

                                this.props.navigation.navigate('ShowCity', { token: res.data.data.mobile });

                            } else {
                                this.props.navigation.popToTop();
                            }
                            DeviceEventEmitter.emit('loginSuccess', {
                                'newMessage': this.state.mobileNum,
                                'applied': res.data.data.applied
                            })

                        },


                    });

                }).catch((err) => {

                });
                // 埋点的设计 登录
                let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
                let params = {
                    act: '登录',

                };
                Http.post(API.testURL + 'log', params).then((res) => {
                }).catch((err) => {
                    setTimeout(() => {
                        this.setState({
                            refreshing: false,

                        });
                    }, 1000);
                });


            } else {

                Toast.show(res.data.msg, {
                    position: Toast.positions.CENTER,
                });

                this.setState({
                    spinner: false,
                });
            }

        }).catch((err) => {

        });
    };

    render() {
        return (
            <SafeAreaView>
                <Spinner visible={this.state.spinner} />
                <ScrollView keyboardShouldPersistTaps={'handled'} scrollEnabled={false} style={{ margin: 0, backgroundColor: 'white' }}>
                    <View>
                        <KeyboardAvoidingView behavior='padding'>
                            <TextInput style={{ padding: 0, marginTop: 80, marginLeft: 20, marginRight: 20, fontSize: px2dp(35) }}
                                placeholder='输入手机号'
                                underlineColorAndroid='transparent'
                                keyboardType='numeric'
                                maxLength={11}
                                clearButtonMode='while-editing'
                                onChangeText={this._changeMobile} />
                            <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20, height: 1, backgroundColor: '#d3d3d3' }} />
                            <View style={{ flexDirection: 'row', marginTop: 30, marginLeft: 20, marginRight: 20, }}>
                                <View style={{ flex: 3 }}>
                                    <TextInput style={{ padding: 0, fontSize: px2dp(35) }}
                                        underlineColorAndroid='transparent'
                                        keyboardType='numeric'
                                        maxLength={6}
                                        clearButtonMode='while-editing'
                                        placeholder='短信验证码'

                                        onChangeText={this._smsCodeChange} />
                                </View>
                                <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} disabled={this.state.disabled} onPress={this._onPressCode}>
                                    <Text style={{ fontSize: px2dp(25), color: this.state.color }}>{this.state.text}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20, height: 1, backgroundColor: '#d3d3d3' }} />
                        </KeyboardAvoidingView>
                        <TouchableOpacity style={{ height: 50, marginLeft: 20, marginRight: 20, marginTop: 50 }} onPress={this._onPressVerifyLogin}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#3F65FF', height: 50, borderRadius: 7 }}>
                                <Text style={{ fontSize: px2dp(35), color: 'white' }}>验证码登录</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
