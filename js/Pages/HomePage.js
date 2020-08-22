import React, { Component } from 'react';
import { Dimensions, PermissionsAndroid, DeviceEventEmitter, SafeAreaView, ScrollView, ImageBackground, Alert, View, Text, Image, TouchableOpacity, RefreshControl, NetInfo, Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Swiper from 'react-native-swiper';
import { EntranceList, PlatformList } from '.././Component';
import { Http, API } from "../Request";
import Toast from 'react-native-root-toast';
import { UserInfo } from '../.././global'
import { px2dp } from '../.././global/Utils'
import Axios from 'axios';
import { init, Geolocation, setLocatingWithReGeocode, setNeedAddress, setInterval, setAllowsBackgroundLocationUpdates } from 'react-native-amap-geolocation'
import HomeHotItem from '../Component/HomeHotItem';
import DeviceInfo from '../../global/DeviceInfo';
import NewCashList from '../Component/NewCashList';
import HomeRecomList from '../Component/HomeRecomList';
import Spinner from 'react-native-loading-spinner-overlay';


const ScreenWidth = Dimensions.get('window').width;
const BannerWidth = ScreenWidth;
const BannerHeight = (ScreenWidth - 40) * 35 / 70;


export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceId: '',
            refreshing: false,
            banners: [],
            notices: [],
            platforms: [],
            deviceinfo: {},
            isVerify: false,
            showPage: false,
            hasLogin: false,
            isValidCity: false,
            isOpenLocation: false,
            hotproduct: '',
            spinner: false,
        };
    };


    async  componentWillMount() {

        if (Platform.OS === "android") {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        }
        await init({
            ios: "a7351c26e8cf75892ebe2965b3c9e050",
            android: "4354119fc67308e731a3b5ee58adf858"
        });
        setLocatingWithReGeocode(true);
        setNeedAddress(true);
        setInterval(2000);
        setAllowsBackgroundLocationUpdates(true);



        this.setState({
            spinner: true,
        })

        //第一次安装是无法获取到信息 返回 error
        storage.load({ key: 'userinfo' }).then(ret => {


            UserInfo.token = ret.token;
            UserInfo.mobileNum = ret.mobileNum;
            UserInfo.isLogined = ret.isLogined;


            storage.load({ key: 'deviceinfo' }).then(ret => {
                DeviceInfo.deviceId = ret.deviceId
                this.getCurrentPosition();
            }).catch((err) => {
                this.getCurrentPosition();
            })

        }).catch((err) => {


            storage.load({ key: 'deviceinfo' }).then(ret => {

                DeviceInfo.deviceId = ret.deviceId
                this.getCurrentPosition();
            }).catch((err) => {

                this.getCurrentPosition();
            })

        });

        NetInfo.addEventListener(
            'connectionChange',
            this._handleFirstConnectivityChange
        );
    }
    //获取当前位置经纬度
    getCurrentPosition() {


        Geolocation.getCurrentPosition(
            position => this.updateLocationState(position),
            error => this.updateLocationState(error)
        )

    }

    //获取当前城市位置
    updateLocationState(location) {
        if (location.code == 1) {
            this.setState({
                spinner: false
            })

            Toast.show('定位未开启,允许使用定位', {
                position: Toast.positions.CENTER,
            });

            this.props.navigation.navigate('LocationEmpty')
            return;
        } else if (location.code == 2 || location.code == 3) {

            // Alert.alert(
            //     '提示',
            //     '当前定位失败',
            //     [
            //         {text: '确定'},
            //     ],
            // );
            this.setState({
                spinner: false
            })

            Toast.show('定位未开启,允许使用定位', {
                position: Toast.positions.CENTER,
            });

            this.props.navigation.navigate('LocationEmpty')
            return;

        }

        else {

            var long = location.coords.longitude;
            var lat = location.coords.latitude;
            var url = 'https://restapi.amap.com/v3/geocode/regeo?output=json&key=4e307ecdd1c10cdcdbb1163316db6d2a' + '&location=' + long + ',' + lat
            //业务逻辑 现获取用户的位置授权，授权后才可以进行业务操作 获得授权后 进行特定城市的判断 在特定城市才进行认证逻辑 ，否则直接跳转贷超逻辑
            Axios.get(url).then((res) => {
                var city = res.data.regeocode.addressComponent.city;
                var province = res.data.regeocode.addressComponent.province;

                if (city.indexOf('北京') > -1 || province.indexOf('北京') > -1) {
                    // alert('在限制城市中');
                    this.setState({
                        isValidCity: true
                    })
                    this._getDeviceid();
                } else {
                    this.setState({
                        isValidCity: false
                    })
                    this._getDeviceid();
                }

            }).catch((err) => {

                this.setState({
                    spinner: false
                })
                Toast.show('获取当前位置失败', {
                    position: Toast.positions.CENTER,
                });
                this.props.navigation.navigate('LocationEmpty')

            })
        }

    }

    componentDidMount() {

        // Geolocation.watchPosition(

        //     position => this.updateLocationState(position),
        //     error => this.updateLocationState(error)

        //  )

        //退出登录时
        this.loginoutScription = DeviceEventEmitter.addListener('loginout', (message) => {
            if (message) {
                this.setState({
                    hasLogin: false
                })
            }
        });


        //登录完成时的跳转逻辑
        this.successScription = DeviceEventEmitter.addListener('loginSuccess', (message) => {

            if (message) {
                if (this.state.isValidCity == true && message.applied == true) {
                    this.setState({
                        spinner: false
                    })
                    this.props.navigation.navigate('LocationProduct');

                } else if (this.state.isValidCity == true && this.state.isVerify !== true) {

                    this.setState({
                        spinner: false
                    })

                    this.props.navigation.navigate('ShowCity', { token: message.newMessage });

                } else {
                    this.setState({
                        hasLogin: true,
                        isVerify: message.applied,
                        spinner: false
                    })
                }
            }

        });

        //网页认证完成返回时刷新页面
        this.refreshSubScription = DeviceEventEmitter.addListener('refresh', (message) => {
            if (message) {
                //如果在指定城市，则跳转到申请失败 否则展示贷超页面
                if (this.state.isValidCity == true) {
                    this.setState({
                        spinner: false
                    })

                    this.props.navigation.navigate('LocationProduct');
                } else {
                    this.setState({
                        isVerify: true,
                        hasLogin: true,
                        spinner: false
                    })
                }
            }
        })

    };

    //移除监听
    componentWillUnmount() {
        this.loginoutScription.remove();
        this.refreshSubScription.remove();
        this.successScription.remove();
    }

    _handleFirstConnectivityChange = () => {

        NetInfo.removeEventListener(
            'connectionChange',
            this._handleFirstConnectivityChange
        );
    };


    //获取设备id的接口
    _getDeviceid = () => {


        if (DeviceInfo.deviceId) {
            UserInfo.deviceId = DeviceInfo.deviceId;
            //1.判断是否登录 没有登录就去登录 如果登录 再判断是否提交验证  如果验证则跳转借贷页面 如果没有验证则跳转webview
            this._onRefresh();


            if (UserInfo.isLogined !== true) {

                this.setState({
                    hasLogin: false,
                    spinner: false
                })
                this.props.navigation.navigate('VerifyLogin');

                return;
            } else {
                this.setState({
                    hasLogin: true
                });

            }

            //获取账号是否认证
            Http.get(API.testURL + 'auth/info').then((res) => {
                if (res.data.data.applied !== true) {
                    this.setState({
                        spinner: false
                    })

                    this.setState.isVerify = res.data.data.applied;
                    this.props.navigation.navigate('ShowCity', { token: res.data.data.mobile });

                    return;
                } else {

                    if (this.state.isValidCity === true) {
                        this.setState({
                            spinner: false
                        })
                        this.props.navigation.navigate('LocationProduct');
                    } else {

                        setTimeout(() => {
                            this.setState({
                                spinner: false,
                                isVerify: true,
                            });
                        }, 1000);
                    }

                }
            }).catch((err) => {

                alert('请求出错');
                this.setState({
                    spinner: false
                })
            });

        } else {
            //step1  获取设备的ID
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

                // step2 应用启动的log
                if (UserInfo.deviceId) {
                    //启动埋点的设置
                    let params = {
                        act: '启动 app',
                    };
                    Http.post(API.testURL + 'log', params).then((res) => {

                    }).catch((err) => {
                        this._getDeviceid();
                        this.setState({
                            refreshing: false,
                        });
                    });

                }
                //step2.1  获取商品数据和轮播图 但没有渲染
                this._onRefresh();
                //step3 判断账号是否登录
                if (UserInfo.isLogined !== true) {
                    this.setState({
                        hasLogin: false,
                        spinner: false
                    })

                    this.props.navigation.navigate('VerifyLogin');

                    return;
                } else {
                    this.setState({
                        hasLogin: true
                    });

                }
                //step4 获取账号是否认证
                Http.get(API.testURL + 'auth/info').then((res) => {
                    if (res.data.data.applied !== true) {
                        this.setState.isVerify = res.data.data.applied;
                        this.props.navigation.navigate('ShowCity', { token: res.data.data.mobile });
                        return;
                    } else {


                        if (this.state.isValidCity == true) {
                            this.setState({
                                spinner: false
                            })
                            this.props.navigation.navigate('LocationProduct');
                        } else {
                            this.setState({
                                isVerify: true,
                                spinner: false,
                            });

                        }

                    }
                }).catch((err) => {


                });
            }).catch((err) => {
                this.setState({
                    spinner: false
                })

                this.props.navigation.navigate('VerifyLogin');
                Alert.alert(
                    '提示',
                    '请设置网络环境',
                    [
                        { text: '确定' },
                    ],
                );


                this.setState({
                    refreshing: false,
                });
            });
        }
    }


    //_onRefresh = () =>

    _onRefresh = () => {

        Http.get(API.testURL + 'product' + '?' + 'type=' + '新品').then((res) => {
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);

            let dataSource = [];
            res.data.data.items.map((item, index) => {
                let platform = {};
                platform.image = item.logo;
                platform.title = item.name;
                platform.subtitle = item.limit;
                platform.subdestitle = item.step;
                platform.url = item.target;

                if (index < 3) {
                    dataSource.push(item);
                }
            });

            this.setState({
                dataSource,
                refreshing: false,
            });
        }).catch((err) => {
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);
        });


        Http.get(API.testURL + 'product').then((res) => {

            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);
            let platforms = [];
            res.data.data.items.map((item, index) => {
                let platform = {};

                platform.image = item.logo;
                platform.id = item.id,
                    platform.is_hot = item.is_hot,
                    platform.requirement = item.requirement;
                platform.title = item.name;
                platform.subtitle = item.limit;
                platform.subdestitle = item.desc;
                platform.url = item.target;
                platform.rate = item.rate;
                platform.duration = item.duration;

                if (index === 0) {
                    hotproduct = platform;
                } else {
                    platforms.push(platform);
                }
            });

            this.setState({
                platforms,
                hotproduct,
                refreshing: false,

            });
        }).catch((err) => {

            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);
        });
    };

    //轮播图点击事件
    _onPressBanner = (index) => {



        let title = this.state.banners[index]['name'];
        let url = this.state.banners[index]['target'];

        if (url !== null) {
            if (url.startsWith('https') || url.startsWith('http')) {
                this.props.navigation.navigate('ShowWeb', { title: title, url: url });


                let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
                let params = {
                    act: '点击申请',
                    extra: {
                        source: '轮播图',
                        product_name: this.state.banners[index]['product_name'],
                        product_id: this.state.banners[index]['product_id'],
                    }
                };

                Http.post(API.testURL + 'log', params).then((res) => {
                }).catch((err) => {
                });
            }
        }
    };

    //分类点击事件
    _onPressEntrance = (index) => {


        let url = this.state.dataSource[index]['target'];


        if (url.startsWith('https') || url.startsWith('http')) {
            this.props.navigation.navigate('ShowWeb', { title: this.state.dataSource[index]['name'], url: this.state.dataSource[index]['target'] });
            //埋点的设计 点击申请
            let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
            let params = {
                act: '点击申请',
                extra: {
                    source: '首页',
                    product_id: this.state.dataSource[index]['id'],
                    product_name: this.state.dataSource[index]['name']
                }

            };

            Http.post(API.testURL + 'log', params).then((res) => {
            }).catch((err) => {
            });

        }





        // if (index === 0) {
        //     this.props.navigation.navigate('Business', {title: '新品专区', type: '新品'});
        // } else if (index === 1) {
        //     this.props.navigation.navigate('Business', {title: '小额速贷', type: '小额'});
        // } else if (index === 2) {
        //     this.props.navigation.navigate('Business', {title: '超低门槛', type: '低门槛'});
        // } else if (index === 3) {
        //     this.props.navigation.navigate('Business', {title: '大额低息', type:'大额'});
        // }
    };

    //热门推荐的点击事件
    _onPressPlatform = (index) => {
        this.props.navigation.navigate('ShowWeb', { title: this.state.platforms[index]['title'], url: this.state.platforms[index]['url'] });
        //埋点的设计 点击申请
        let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
        let params = {
            act: '点击申请',
            extra: {
                source: '首页',
                product_id: this.state.platforms[index]['id'],
                product_name: this.state.platforms[index]['title']
            }

        };
        Http.post(API.testURL + 'log', params).then((res) => {
        }).catch((err) => {
        });

    };

    //一键拿钱
    _onPressGoManey = () => {


        let url = this.state.hotproduct.url;
        if (url.startsWith('https') || url.startsWith('http')) {
            this.props.navigation.navigate('ShowWeb', { title: this.state.hotproduct.title, url: this.state.hotproduct.url });

            //埋点的设计 点击申请
            let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
            let params = {
                act: '点击申请',
                extra: {
                    source: '首页',
                    product_id: this.state.hotproduct.id,
                    product_name: this.state.hotproduct.title
                }
            };
            Http.post(API.testURL + 'log', params).then((res) => {
            }).catch((err) => {
            });
        }
    }


    renderGetView() {
        if (this.state.hotproduct.title) {
            return (
                <TouchableOpacity onPress={this._onPressGoManey}>
                    <ImageBackground style={{ justifyContent: "center", alignItems: 'center', marginLeft: 20, marginRight: 20, height: 36, marginBottom: 10, borderRadius: 10 }} source={require('../.././assets/home_go_v1.png')}>
                        <Text style={{ color: 'white' }}>一键拿钱</Text>
                    </ImageBackground>
                </TouchableOpacity>


            )

        } else {

            return (

                <TouchableOpacity >
                    <ImageBackground style={{ justifyContent: "center", alignItems: 'center', marginLeft: 20, marginRight: 20, height: 36, marginBottom: 10, borderRadius: 10 }} source={require('../.././assets/home_go_v1.png')}>
                        <Text style={{ color: 'white' }}>敬请期待</Text>
                    </ImageBackground>
                </TouchableOpacity>
            )
        }
    }


    render() {
        if (this.state.hasLogin == true && this.state.isVerify == true) {
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <Spinner visible={this.state.spinner} />
                    <ScrollView style={{ backgroundColor: '#ffffff', marginTop: -20 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl title={'正在加载...'} refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
                        <View style={{ flex: 1, paddingLeft: 0, paddingRight: 0, paddingTop: 0, backgroundColor: '#ffffff' }}>
                            <ImageBackground style={{ top: 0, height: 180, width: ScreenWidth, justifyContent: "center", alignItems: 'center', }} source={require('../.././assets/home_bg.png')}>

                            </ImageBackground >


                            <View style={{ shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3, borderColor: '#F4F3F4', backgroundColor: 'white', height: 190, marginLeft: 20, marginRight: 20, marginTop: -140, borderRadius: 10 }}>

                                <View style={{ flexDirection: 'row', marginLeft: 10, backgroundColor: '' }}>
                                    <Image style={{ paddingLeft: 15, height: px2dp(50), width: px2dp(100), borderRadius: 10, height: px2dp(100), marginTop: 20, marginLeft: 13, marginRight: 5 }} source={{ uri: this.state.hotproduct.image }}
                                    />

                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ color: '#000000', fontSize: px2dp(36), fontWeight: 'bold', paddingLeft: 10, marginTop: 22 }}>{this.state.hotproduct.title}</Text>
                                        <Text style={{ paddingLeft: 10, marginTop: 10, fontSize: 12, color: '#a8a8a8' }}>{this.state.hotproduct.subdestitle}</Text>

                                    </View>

                                </View>

                                <View style={{ height: 60, flexDirection: 'row', flex: 1, marginLeft: 10 }}>
                                    <View style={{ flex: 0.5, flexDirection: 'column' }}>
                                        <Text style={{ alignSelf: 'flex-start', paddingTop: 15, paddingLeft: 13, alignSelf: 'flex-start', textAlign: 'center', color: '#f03a4a', fontSize: 20 }}>{this.state.hotproduct.subtitle}</Text>
                                        <Text style={{ fontSize: 12, paddingTop: 8, paddingLeft: 13, alignSelf: 'flex-start', textAlign: 'center', color: '#a8a8a8' }}>最高可借(元)</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', flex: 0.5 }}>
                                        <Text style={{ paddingTop: 23, paddingLeft: 10, alignSelf: 'flex-start', color: '#a8a8a8', fontSize: 12 }}>借款周期: {this.state.hotproduct.duration}</Text>
                                        <Text style={{ paddingTop: 10, paddingLeft: 10, alignSelf: 'flex-start', color: '#a8a8a8', fontSize: 12 }}>日利率: {this.state.hotproduct.rate}</Text>
                                    </View>

                                </View>
                                {
                                    this.renderGetView()
                                }
                            </View>

                            <View style={{ alignItems: 'center', marginLeft: 20, flexDirection: 'row', marginTop: 10, marginBottom: 5 }}>
                                <Image style={{ resizeMode: 'contain', paddingLeft: 5, height: px2dp(24), marginTop: 4, width: px2dp(30), height: px2dp(30), marginLeft: 0, marginRight: 5 }}
                                    source={require('../.././assets/home_hot.png')} />
                                <Text style={{ color: '#a8a8a8', fontStyle: 'italic', fontSize: px2dp(24), marginTop: 8, paddingLeft: 5 }} numberOfLines={1}>建议同时申请3～5款产品,通过率99%</Text>

                            </View>

                            <View style={{ alignItems: 'center', marginLeft: 20, flexDirection: 'row', marginTop: 10, marginBottom: 15 }}>
                                <View style={{ width: 5, height: 15, backgroundColor: 'orange' }} />
                                <Text style={{ marginLeft: 5, color: '#000000', fontSize: px2dp(30), fontWeight: 'bold' }} numberOfLines={1}>最新口子</Text>

                            </View>

                            <NewCashList datasource={this.state.dataSource}
                                onPress={this._onPressEntrance} />

                            <View style={{ alignItems: 'center', marginLeft: 20, flexDirection: 'row', marginTop: 22, marginBottom: 10 }}>
                                <View style={{ width: 5, height: 15, backgroundColor: 'orange' }} />
                                <Text style={{ marginLeft: 5, color: '#000000', fontSize: px2dp(30), fontWeight: 'bold' }} numberOfLines={1}>热门推荐</Text>
                            </View>

                            <HomeRecomList datasource={this.state.platforms}
                                onPress={this._onPressPlatform} />

                        </View>

                    </ScrollView>

                </SafeAreaView>
            )
        } else {
            return (
                <Spinner visible={this.state.spinner} />
            )
        }

    }
}
