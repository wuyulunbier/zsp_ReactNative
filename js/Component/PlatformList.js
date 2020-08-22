import React, { Component } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { px2dp } from '../.././global/Utils'

const ScreenWidth = Dimensions.get('window').width;

// 平台推荐
export default class PlatformList extends Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                    this.props.datasource.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => this.props.onPress(index)}>
                                <View style={{ justifyContent: 'center', height: 80, width: (ScreenWidth - 20) / 2 }}>
                                    <PlatformItem image={item.image} title={item.title} subtitle={item.subtitle} subdestitle={item.subdestitle} is_hot={item.is_hot} />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
        );
    }
}

class PlatformItem extends Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', borderColor: '#FF3648', alignItems: 'center', marginLeft: px2dp(30) }}>
                <Image style={{ resizeMode: 'stretch', height: px2dp(106), width: px2dp(106), borderRadius: 5, marginRight: 12 }}
                    source={{ uri: this.props.image }} />
                <View>
                    <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: px2dp(7) }}>

                        <Text style={{ fontSize: px2dp(28), color: '#000000', fontWeight: 'bold' }}>{this.props.title}</Text>
                        <View style={{ flex: 1 }}>

                            <Image style={{ height: px2dp(27), width: px2dp(27), marginTop: -5, marginLeft: 5, marginRight: 5 }}
                                source={this.props.is_hot === true ? require('../.././assets/hot_producr.png') : null} />
                        </View>
                    </View>

                    <Text style={{ fontSize: px2dp(24), color: '#FF3648', fontWeight: 'bold' }}>{this.props.subtitle}</Text>

                    <Text numberOfLines={2} style={{ fontSize: px2dp(20), width: px2dp(200), color: '#ceced2', fontWeight: 'bold' }}>{this.props.subdestitle}</Text>
                </View>
            </View>
        );
    }
}
