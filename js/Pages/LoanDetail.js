import React, { Component } from 'react';
import { CommonItem } from '.././Component'
import { Dimensions, SafeAreaView, ScrollView, SectionList, View, Text, ImageBackground, Image, TouchableOpacity, RefreshControl, NetInfo, Platform } from 'react-native';
import { Http, API } from "../Request";
import { px2dp } from '../.././global/Utils'
import InfoItem from '../Component/InfoItem';
import { italic } from 'ansi-colors';
import { UserInfo, deviceId } from '../../global'
import InfoDetaItem from '../Component/InfoDetaItem';

const ScreenWidth = Dimensions.get('window').width;

// 贷款详情
export default class LoanDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            deviceId: '',
            refreshing: false,
            productId: '',
            productname: '',
            source: '',
            dataInfo: {},
            name: '',
            desc: '',
            limit: '',
            target: '',
            rate: '',
            duration: '',
            step: '',
            requirement: '',
            mode: '',
        };
    };

    componentWillMount() {
        //接受产品ID

    }

    componentDidMount() {


        this.productId = this.props.navigation.state.params.id;
        // this.state.productname = this.props.navigation.state.params.productname;
        // this.source = this.props.navigation.state.params.source;
        this._onRefresh();
        storage.load({ key: 'deviceinfo' }).then(ret => {
            this.state.deviceId = ret.id;
        }).catch((err) => {

        });
        //埋点的设计 点击产品
        let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
        let params = {
            act: '点击产品',
            extra: {
                source: this.props.navigation.state.params.source,
                product_id: this.props.navigation.state.params.id,
                product_name: this.props.navigation.state.params.productname
            }

        };
        Http.post(API.testURL + 'log', params).then((res) => {
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);

        }).catch((err) => {
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);
        });
    }

    // _onPressItem = (section, row) => {
    //   //点击事件
    // };
    _renderItem = ({ item, index, section: { section } }) => {
        return (
            <InfoDetaItem
                section={section}
                row={index}
                title={item.title}
                tips={item.tips} />
        );
    };

    _onRefresh = () => {
        let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
        this.setState({
            refreshing: true,
        });
        //获取详情数据
        Http.get(API.testURL + 'product/' + this.productId).then((res) => {
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);

            this.setState({
                dataInfo: res.data.data,
                name: res.data.data.name,
                limit: res.data.data.limit,
                desc: res.data.data.desc,
                target: res.data.data.target,
                rate: res.data.data.rate,
                duration: res.data.data.duration,
                step: res.data.data.step,
                requirement: res.data.data.requirement,
                mode: res.data.data.mode
            });

        }).catch((err) => {
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);
        });

    }
    _getDetailData() {

    }
    _onPressGetCash = () => {
        //埋点的设计 点击申请
        let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
        let params = {
            act: '点击申请',
            extra: {
                source: this.props.navigation.state.params.source,
                product_id: this.props.navigation.state.params.id,
                product_name: this.props.navigation.state.params.productname
            }

        };

        //  alert('点击申请');
        Http.post(API.testURL + 'log', params).then((res) => {
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);
        }).catch((err) => {
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
            }, 1000);
        });
        if (UserInfo.isLogined !== true) {

            this.props.navigation.navigate('VerifyLogin');
            return;
        }


        this.props.navigation.navigate('ShowWeb', { title: '申请贷款', url: this.state.target });
    }

    _renderSectionFooter = () => {
        return (
            <TouchableOpacity style={{ height: 50, marginLeft: 20, marginRight: 20, marginTop: 10 }} onPress={this._onPressGetCash}>
                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#3F65FF', height: 50, borderRadius: 7 }}>
                    <Text style={{ fontSize: 17, color: 'white' }}>立即借款</Text>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        const sections = [{
            section: 0, data: [{ title: '所需材料:', tips: this.state.step },
            { title: '申请条件:', tips: this.state.requirement }, { title: '审批方式:', tips: this.state.mode }]
        }];

        let itemInfo = this.dataInfo;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ backgroundColor: '#F5F5F5' }} refreshControl={<RefreshControl title={'正在加载...'} refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
                    <View>
                        <ImageBackground style={{ top: 0, height: px2dp(230), width: ScreenWidth, justifyContent: "center", alignItems: 'center', }} source={require('../.././assets/detail_bg.png')}>

                            <Text style={{ color: '#FFFFFF', fontSize: 23, fontWeight: 'bold' }}>{this.state.name}</Text>
                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>{this.state.desc}</Text>
                            <Text style={{ color: '#FFFFFF', fontSize: 25 }}>{this.state.limit}</Text>
                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>可借额度</Text>

                        </ImageBackground>
                    </View>

                    <View style={{ backgroundColor: '#FFFFFF', height: px2dp(200) }}>
                        <InfoItem datasource={[{ title: '5分钟', subtitle: '最快下载' },
                        { title: this.state.dataInfo.duration, subtitle: '借款期限' },
                        { title: this.state.dataInfo.rate, subtitle: '日利率' }]} />

                    </View>

                    <View style={{ backgroundColor: '#F5F5F5', height: px2dp(70), justifyContent: "center", alignItems: 'center', }}>
                        {/* <Image  source={require('../.././assets/detail_dot.png')} style={{justifyContent:'center',alignItems:'center',}}></Image> */}
                        <Text style={{ justifyContent: 'center', alignItems: 'center', color: 'gray' }}>本周平台数据</Text>

                    </View>

                    <View style={{ backgroundColor: '#FFFFFF', height: px2dp(200) }}>

                        <InfoItem datasource={[{ title: this.state.dataInfo.rate_of_lend, subtitle: '通过率' },
                        { title: this.state.dataInfo.count_of_apply, subtitle: '借款人数' },
                        { title: this.state.dataInfo.count_of_lend, subtitle: '本周成功人数' }]} />

                    </View>

                    <View style={{ backgroundColor: '#F5F5F5', height: px2dp(70), justifyContent: "center", alignItems: 'center', }}>
                        {/* <Image source={require('../.././assets/detail_dot.png')}></Image> */}
                        <Text style={{ color: 'gray' }}>产品信息</Text>

                    </View>

                    <SectionList
                        sections={sections}
                        // extraData={this.state}
                        // keyExtractor={(item, index) => index}
                        renderItem={this._renderItem}
                        // renderSectionHeader={() => (<View style={{height: 0, backgroundColor: '#F5F5F5'}} />)}
                        renderSectionFooter={this._renderSectionFooter}
                        ItemSeparatorComponent={() => (<View style={{ marginLeft: 2, marginRight: 2, height: 0.1, backgroundColor: '#d3d3d3' }} />)}
                    // ListHeaderComponent={this._renderListHeader}
                    />
                </ScrollView>
            </SafeAreaView>
        )

    }
}