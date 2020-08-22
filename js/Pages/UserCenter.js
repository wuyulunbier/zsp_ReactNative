import React, { Component } from 'react'
import { Dimensions, SafeAreaView, View, Image, DeviceEventEmitter, Text, TouchableOpacity, SectionList, Alert, ImageBackground } from 'react-native'
import { CommonItem } from '.././Component'
import { UserInfo } from '../.././global'
import { px2dp } from '../.././global/Utils'

const ScreenWidth = Dimensions.get('window').width;

export default class UserCenter extends Component {
    constructor(props) {
        super(props);
        this.state = { userStatus: '请先登录' };
    };

    componentWillMount() {

        this._onRefresh();
    }

    componentDidMount() {

        // 监听登录状态的改变
        this.refreshSubScription = DeviceEventEmitter.addListener('loginSuccess', (message) => {
            if (message) {
                storage.load({ key: 'userinfo' }).then(ret => {
                    UserInfo.token = ret.token;
                    UserInfo.mobileNum = ret.mobileNum;
                    UserInfo.isLogined = ret.isLogined;

                }).catch((err) => {

                });

                this.setState({
                    userStatus: UserInfo.mobileNum,
                });

            }
        })

    };
    componentWillUnmount() {
        this.refreshSubScription.remove();
    }

    _onRefresh = () => {
        storage.load({ key: 'userinfo' }).then(ret => {
            UserInfo.token = ret.token;
            UserInfo.mobileNum = ret.mobileNum;
            UserInfo.isLogined = ret.isLogined;

        }).catch((err) => {

        });

        if (UserInfo.isLogined === true) {
            this.setState({
                userStatus: UserInfo.mobileNum,
            });
        } else {
            this.setState({
                userStatus: '请先登录',
            });
        }
    };

    //跳转到登录界面
    _onPressLogin = () => {
        this.props.navigation.navigate('VerifyLogin', {
            callBack: () => {
                this._onRefresh();
            }
        });
    };

    _onPressItem = (section, row) => {
        if (UserInfo.isLogined !== true) {
            this._onPressLogin();
            return;
        }
        if (row === 0) {
            this.props.navigation.push('ContactUs');
        } else if (row === 1) {
            this.props.navigation.navigate('ShowWeb', { title: '个人征信', url: 'https://wdzx.bilibilidata.cn/mini/h5/credit.html' });
        } else if (row === 2) {

        }
    };

    _onPressLoginOut = () => {
        Alert.alert(
            '提示',
            '安全退出',
            [
                {
                    text: '确定', onPress: () => {
                        UserInfo.token = '';
                        UserInfo.mobileNum = '';
                        UserInfo.isLogined = false;
                        storage.save({
                            key: 'userinfo',
                            data: {
                                token: '',
                                mobileNum: '',
                                isLogined: false,
                            },
                        });

                        this._onRefresh();
                        DeviceEventEmitter.emit('loginout', {
                            'newMessage': '新消息',
                        })
                        this.props.navigation.navigate('VerifyLogin');
                    }
                },
                { text: '取消', onPress: () => { }, style: 'cancel' },
            ],
        );
    };

    _renderItem = ({ item, index, section: { section } }) => {
        return (
            <CommonItem onPress={this._onPressItem}
                section={section}
                row={index}
                image={item.image}
                title={item.title}
                tips={item.tips} />
        );
    };

    _renderListHeader = () => {
        return (
            <View style={{ height: 200, justifyContent: 'center' }}>
                <ImageBackground style={{ width: ScreenWidth, height: 200, alignItems: 'center', }} source={require('../.././assets/blue_bg.png')}>
                    <TouchableOpacity onPress={this._onPressLogin} disabled={this.state.userStatus !== '请先登录'}>
                        <View style={{ alignItems: 'center', marginTop: 40 }}>
                            <Image style={{ height: 70, width: 70, borderRadius: 35 }}
                                source={require('../.././assets/dsh_head.png')} />
                            <Text style={{ marginTop: px2dp(25), fontSize: px2dp(30), color: 'white' }}>{this.state.userStatus}</Text>
                        </View>
                    </TouchableOpacity>

                </ImageBackground>
            </View>
        );
    };

    _renderSectionFooter = () => {
        return (
            <TouchableOpacity style={{ height: 50, marginLeft: 20, marginRight: 20, marginTop: 100 }} onPress={this._onPressLoginOut}>
                {/* <Image style={{alignItems: 'center', justifyContent: 'center',height: 50, borderRadius: 7,}} */}
                {/* source={require('../.././assets/logout_v1.png')}/> */}
                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#3F65FF', height: 50, borderRadius: 7 }}>
                    <Text style={{ fontSize: 17, color: 'white' }}>退出登录</Text>
                </View>
            </TouchableOpacity>
        );
    };

    render() {//{image: require('../.././assets/setting-2.png'), title: '清除缓存', tips: ''}
        const sections = [{
            section: 0, data: [{ image: require('../.././assets/info_message.png'), title: '联系我们', tips: '' },
            { image: require('../.././assets/info_promise.png'), title: '个人征信', tips: '' }
            ]
        }];

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <SectionList
                    sections={sections}
                    extraData={this.state}
                    keyExtractor={(item, index) => index}
                    renderItem={this._renderItem}
                    renderSectionHeader={() => (<View style={{ height: 0, backgroundColor: '#F5F5F5' }} />)}
                    renderSectionFooter={this.state.userStatus !== '请先登录' ? this._renderSectionFooter : null}
                    ItemSeparatorComponent={() => (<View style={{ marginLeft: 2, marginRight: 2, height: 0.1, backgroundColor: '#d3d3d3' }} />)}
                    ListHeaderComponent={this._renderListHeader}
                />
            </SafeAreaView>
        );
    }
}
