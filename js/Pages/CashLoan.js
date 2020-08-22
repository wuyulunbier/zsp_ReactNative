import React, { Component } from 'react';
import { Dimensions, FlatList, SafeAreaView, ScrollView, View, Button, ImageBackground, Text, Image, TouchableOpacity, RefreshControl, NetInfo, Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Swiper from 'react-native-swiper';
import { EntranceList, SectionList, PlatformList } from '../Component';
import { Http, API } from "../Request";
import Toast from 'react-native-root-toast';
import { UserInfo, deviceId } from '../../global'
import { px2dp } from '../../global/Utils'
import CashList from '../Component/CashList';
import Greeting from '../Component/Hello';



const ScreenWidth = Dimensions.get('window').width;
const BannerWidth = ScreenWidth - 20;
const BannerHeight = (ScreenWidth - 20) * 35 / 70;

export default class CashPage extends Component {
    constructor(props) {
        super(props);
        //当前页
        this.page = 1
        this.state = {
            refreshing: false,
            // banners: [],
            // notices: [],
            platforms: [],
            dataSource: [],
            // 加载更多
            isLoadMore: false,
            // 控制foot  1：正在加载   2 ：无更多数据
            showFoot: 1,
            deviceId: '',
            type: '',
            Authorization: '',

        };
    };

    componentWillMount() {


        NetInfo.addEventListener(
            'connectionChange',
            this._handleFirstConnectivityChange
        );
    }

    componentDidMount() {


        //埋点的设计  进入贷款页
        storage.load({ key: 'deviceinfo' }).then(ret => {
            this.state.deviceId = ret.id;
        }).catch((err) => {

        });
        storage.load({ key: 'userinfo' }).then(ret => {
            UserInfo.token = ret.token;
            UserInfo.mobileNum = ret.mobileNum;
            UserInfo.isLogined = ret.isLogined;

            this.Authorization = ret.token;
            this._onRefresh();
        }).catch((err) => {
            // SplashScreen.hide();
            this._onRefresh();
        });



        let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';

        let params = {
            act: '进入贷款页',
        };
        Http.post(API.testURL + 'log', params).then((res) => {
        }).catch((err) => {
        });

    };

    _handleFirstConnectivityChange = () => {
        //        this._onRefresh();
        NetInfo.removeEventListener(
            'connectionChange',
            this._handleFirstConnectivityChange
        );
    };

    _getHotList() {

        let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
        Http.post(API.testURL).then((res) => {
            setTimeout(() => {
                this.setState({
                    spinner: false,
                });
            }, 1000);


        }).catch((err) => {
            setTimeout(() => {
                this.setState({
                    spinner: false,
                });
            }, 1000);
            Toast.show(err, {
                position: Toast.positions.CENTER,
            });
        });

        Http.get(API.testURL + 'product').then((res) => {
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);

            var message = JSON.stringify(res);
            let dataSource = [];
            res.data.data.items.map((item, index) => {
                let platform = {};
                platform.image = item.logo;
                platform.title = item.name;
                platform.subtitle = item.limit;
                platform.subdestitle = item.step;
                platform.url = item.target_url;
                dataSource.push(item);
            });

            this.setState({
                dataSource,
                //   refreshing:false,
            });
        }).catch((err) => {
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);
        });

        this.setState({
            refreshing: false,
        });
    }

    _createListItem(item) {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => this._onItemClick(item)}>
                <View style={{
                    flexDirection: 'row',
                    borderRadius: 6,
                    width: (ScreenWidth - 20),
                    height: 100,
                    marginTop: 5,
                    backgroundColor: '#FFFFFF',
                    marginLeft: 10

                }}>

                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ marginLeft: 15, top: 10, height: px2dp(100), width: 130, flexDirection: 'row' }}>
                            <Image style={{ resizeMode: 'stretch', width: px2dp(80), top: 0, left: 5, height: px2dp(80), borderRadius: 3 }} source={{ uri: item.logo }} />
                            <Text style={{ left: 20, width: 120, paddingTop: 10, height: 50, fontSize: px2dp(30) }}>{item.name}</Text>
                        </View>

                        <View style={{ left: 15, width: 130, top: 15, flexDirection: 'column' }}>
                            <Text style={{ top: 0, height: 10, left: 5, fontSize: px2dp(18), color: 'gray' }}>贷款期限 {item.duration}</Text>
                            <Text style={{ top: 6, left: 5, height: 20, fontSize: px2dp(18), color: 'gray' }}>利率范围  {item.rate}</Text>
                        </View>

                    </View>

                    <View style={{ height: 90, top: 10, flex: 2, flexDirection: 'column' }}>
                        <Text style={{ alignSelf: 'flex-end', top: 10, right: 20, height: 20, textAlign: 'center', fontSize: px2dp(32), color: '#000000' }}>{item.limit}</Text>
                        <Text style={{ alignSelf: 'flex-end', right: 20, textAlign: 'center', top: 10, fontSize: px2dp(18), color: 'gray' }}>额度范围 (元)</Text>
                        <ImageBackground style={{ alignSelf: 'flex-end', right: 20, top: 20, height: 30, justifyContent: "center", alignItems: 'center', width: 80, borderRadius: 7 }} source={require('../.././assets/now_cash.png')}>

                            <Text style={{ left: 10, width: 80, justifyContent: "center", color: '#FFFFFF' }}>立即申请</Text>

                        </ImageBackground>
                    </View>



                </View>
            </TouchableOpacity>
        );
    }

    _extraUniqueKey(item, index) {
        return item.key;
    }
    /**
       * item点击事件
       */
    _onItemClick(item) {

        //埋点的设计 点击申请
        let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
        let params = {
            act: '点击申请',
            extra: {
                source: '贷款',
                product_id: item.id,
                product_name: item.name
            }

        };
        Http.post(API.testURL + 'log', params).then((res) => {

        }).catch((err) => {

        });

        let url = item.target;

        if (url.startsWith('https') || url.startsWith('http')) {
            if (url.indexOf('http') > -1 || url.indexOf('https') > -1) {
                this.props.navigation.navigate('ShowWeb', { title: item.name, url: url });
            }
        }



        // if (UserInfo.isLogined !== true) {
        //     this.props.navigation.navigate('VerifyLogin');
        //     return;
        // }
        // this.props.navigation.navigate('LoanDetail', {title: '贷款详情', id:item.id,productname:item.name,source:'贷款',url: 'https://wdzx.bilibilidata.cn/mini/h5/index.html'});

    }
    _onPressPlatform = (index) => {
        let title = this.state.platforms[index]['title'];
        let url = this.state.platforms[index]['url'];
        alert('9');


        if (url.indexOf('http') > -1 || url.indexOf('https') > -1) {
            this.props.navigation.navigate('ShowWeb', { title: title, url: url });
        }
    };
    /**
 * 空布局
 */
    _createEmptyView() {
        return (
            <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16 }}>
                    暂无列表数据，下拉刷新
            </Text>
            </View>
        );//{this.state.dataSource}
    }

    /**
        * 下啦刷新
        * @private
        */
    _onRefresh = () => {
        // 不处于 下拉刷新
        // if (!this.state.isRefresh) {
        // this.page = 1

        this._getHotList()
        //  }
    };

    /**
    * 加载更多
    * @private
    */
    _onLoadMore() {
        // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
        if (!this.state.isLoadMore && this.state.dataSource.length > 0 && this.state.showFoot !== 2) {
            // this.page = this.page + 1
            this._getHotList()
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>

                <FlatList style={{ flex: 1, backgroundColor: '#f5f5f5' }} data={this.state.dataSource}
                    //item显示的布局
                    renderItem={({ item }) => this._createListItem(item)}
                    // 空布局
                    ListEmptyComponent={this._createEmptyView}

                    //下拉刷新相关
                    // onRefresh={() => this._onRefresh()}

                    RefreshControl title={'正在加载...'} refreshing={this.state.refreshing} onRefresh={this._onRefresh}
                    // refreshControl={
                    //     <RefreshControl
                    //         title={'Loading'}
                    //         colors={['red']}
                    //         refreshing={this.state.isRefresh}
                    //         onRefresh={() => {
                    //             this._onRefresh();
                    //         }}
                    //     />
                    // }
                    // refreshing={this.state.isRefresh}
                    //加载更多
                    //onEndReached={() => this._onLoadMore()}
                    onEndReachedThreshold={0.1}
                    ItemSeparatorComponent={this._separator}
                    keyExtractor={this._extraUniqueKey}
                />
            </View>
        )
    }
}





