import React, { Component } from 'react';
import { Dimensions, View, Image, Text, ImageBackground, TouchableOpacity } from "react-native";
import { px2dp } from '../.././global/Utils'

const ScreenWidth = Dimensions.get('window').width;

export default class NewCashList extends Component {
    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                {
                    this.props.datasource.map((item, index) => {

                        return (
                            <TouchableOpacity key={index} onPress={() => this.props.onPress(index)}>

                                <View style={{ backgroundColor: '', marginLeft: 25, alignItems: 'center', justifyContent: 'center', height: 90, width: (ScreenWidth - 100) / 3 }}>
                                    <EntranceItem image={item.logo} title={item.name} limit={item.limit} />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
        );
    }
}

class EntranceItem extends Component {
    render() {
        return (

            // <ImageBackground style={{resizeMode: 'contain',backgroundColor:'red',width:(ScreenWidth-60)/3,height:100}} source={require('../.././assets/home_center_bg.png')}>

            // </ImageBackground>

            <View style={{ shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, elevation: 3, borderColor: 'gray', borderRadius: 10, backgroundColor: 'white', width: (ScreenWidth - 70) / 3, paddingLeft: 5, height: 100 }} >
                <View style={{ flexDirection: 'row', }}>
                    <Image style={{ marginTop: 10, height: px2dp(50), width: px2dp(50), borderRadius: px2dp(25) }}
                        source={{ uri: this.props.image }} />
                    <Text numberOfLines={1} style={{ marginTop: 15, textAlign: 'center', fontSize: px2dp(26), paddingLeft: 10, color: '#000000' }}>{this.props.title}</Text>

                </View>

                <Text numberOfLines={1} style={{ paddingLeft: 5, alignSelf: 'center', color: '#f03a4a', fontSize: 14, marginTop: 10, justifyContent: 'center' }}>{this.props.limit}</Text>
                <Text style={{ paddingLeft: 5, alignSelf: 'center', fontSize: px2dp(24), marginTop: 12, color: '#a8a8a8' }}>最高可借(元)</Text>

            </View>
        );
    }
}
