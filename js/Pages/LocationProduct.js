import React, { Component } from 'react';
import { CommonItem } from '.././Component'
import { Dimensions, BackHandler, SafeAreaView, ScrollView, SectionList, View, Text, ImageBackground, Image, TouchableOpacity, RefreshControl, NetInfo, Platform } from 'react-native';
import { Http, API } from "../Request";
import { px2dp } from '../.././global/Utils'
import InfoItem from '../Component/InfoItem';
import { italic } from 'ansi-colors';
import { UserInfo, deviceId } from '../../global'
import InfoDetaItem from '../Component/InfoDetaItem';
import HomeHotItem from '../Component/HomeHotItem';
import Axios from 'axios';
import LocationHotList from '../Component/LocationHotList';

const ScreenWidth = Dimensions.get('window').width;

// 贷款详情
export default class LocationProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            platforms: [],
        };
    };

    componentWillMount() {

        if (Platform.OS === 'android') {
            this.listener = BackHandler.addEventListener('hardwareBackPress', function () {
                return true;
            });
        }


        let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
        Axios.get(API.testURL + 'id', {
            headers: {
                'Content-Type': 'application/json',
                'X-Platform': software_platform
            }
        }).then((response) => {

            UserInfo.deviceId = response.data.data.id;

            this._onRefresh();


        })


    }
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            this.listener.remove('hardwareBackPress');
        }
    }

    _onRefresh = () => {

        Http.get(API.testURL + 'product').then((res) => {

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

                if (index < 3) {
                    platforms.push(platform);
                }


            });

            this.setState({
                platforms,
                refreshing: false,
            });
        }).catch((err) => {


        });

    }

    componentDidMount() {

    }

    _onPressPlatform = (index) => {

        this.props.navigation.navigate('ShowWeb', { title: this.state.platforms[index]['title'], url: this.state.platforms[index]['url'] });
        //埋点的设计 点击申请
        let software_platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'h5';
        let params = {
            act: '点击申请',
            extra: {
                source: '其他热门推荐',
                product_id: this.state.platforms[index]['id'],
                product_name: this.state.platforms[index]['title']
            }

        };

        Http.post(API.testURL + 'log', params).then((res) => {
        }).catch((err) => {
        });

    };

    render() {

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ backgroundColor: '' }} showsVerticalScrollIndicator={false} >

                    <View style={{ alignItems: 'center', backgroundColor: '', paddingTop: 0 }}>

                        <Image style={{ resizeMode: 'stretch', width: ScreenWidth, height: 300 }} source={require('../.././assets/apply_not_v1.png')}></Image>

                        <ImageBackground style={{ marginTop: 30, justifyContent: "center", width: 190, height: 49, alignItems: 'center' }} source={require('../.././assets/apply_not_bg.png')}>
                            <Text style={{ fontSize: 18, color: 'gray', textAlign: 'center' }}>申请未通过</Text>
                        </ImageBackground>

                        <View style={{ paddingTop: 50, flexDirection: 'row' }}>
                            <Image style={{ height: 16, width: 16 }} source={require('../.././assets/location_hot_v1.png')}></Image>
                            <Text style={{ color: 'orange', textAlign: 'left', alignSelf: 'center', paddingLeft: px2dp(20) }}>其他热门产品推荐</Text>
                        </View>
                        <Image style={{ marginTop: 10, height: 25, width: 40 }} source={require('../.././assets/hot_arraw.png')}></Image>

                    </View>
                    <LocationHotList datasource={this.state.platforms} onPress={this._onPressPlatform} />
                </ScrollView>

            </SafeAreaView>
        )

    }
}