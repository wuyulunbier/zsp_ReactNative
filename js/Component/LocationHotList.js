import React, { Component } from 'react';
import { Dimensions, View, Image, ImageBackground, Text, TouchableOpacity } from "react-native";
import { px2dp } from '../../global/Utils'

const ScreenWidth = Dimensions.get('window').width;

export default class LocationHotList extends Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', marginLeft: 40, marginTop: 10 }}>
                {
                    this.props.datasource.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => this.props.onPress(index)}>
                                <View style={{ backgroundColor: '', alignItems: 'center', justifyContent: 'center', height: (ScreenWidth - 80) / 3, width: (ScreenWidth - 80) / 3 }}>
                                    <EntranceItem image={item.image} title={item.title} />
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
            <View style={{ alignItems: 'center', backgroundColor: '' }}>
                <ImageBackground style={{ marginTop: 10, justifyContent: "center", width: px2dp(110), height: px2dp(110), alignItems: 'center' }} source={require('../.././assets/loaction_pro_bg.png')}>
                    <Image style={{ marginTop: 0, height: px2dp(80), width: px2dp(80), borderRadius: 20 }}
                        source={{ uri: this.props.image }} />
                </ImageBackground>

                <Text style={{ textAlign: 'center', marginTop: px2dp(20), fontSize: px2dp(24), color: '#000000' }}>{this.props.title}</Text>
            </View>
        );
    }
}
