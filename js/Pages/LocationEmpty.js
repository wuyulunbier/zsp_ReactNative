import React, { Component } from 'react';
import { CommonItem } from '.././Component'
import { Dimensions, BackHandler, SafeAreaView, ScrollView, SectionList, View, Text, ImageBackground, Image, TouchableOpacity, RefreshControl, NetInfo, Platform } from 'react-native';
import { Http, API } from "../Request";
import { px2dp } from '../.././global/Utils'
import InfoItem from '../Component/InfoItem';
import { italic } from 'ansi-colors';
import { UserInfo, deviceId } from '../../global'
import InfoDetaItem from '../Component/InfoDetaItem';

const ScreenWidth = Dimensions.get('window').width;

// 贷款详情
export default class LocationEmpty extends Component {

    constructor(props) {
        super(props);
        this.state = {
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

    }

    componentDidMount() {



    }

    render() {

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', backgroundColor: '', flex: 1 }}>
                    <ImageBackground style={{ justifyContent: "center", alignItems: 'center' }} source={require('../.././assets/locaton_empty.png')}>

                        <Image style={{ marginTop: 100, width: 180, height: 100 }} source={require('../.././assets/location_tip.png')}></Image>

                        <Text style={{ backgroundColor: '', fontSize: 14, color: 'gray', paddingTop: 60, flex: 1, textAlign: 'center' }}>请允许使用定位，获取当前地址</Text>

                    </ImageBackground>

                </View>

            </SafeAreaView>
        )

    }
}