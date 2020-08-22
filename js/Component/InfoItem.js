import React, { Component } from 'react';
import { Dimensions, View, Image, Text, TouchableOpacity } from "react-native";
import { px2dp } from '../.././global/Utils'

const ScreenWidth = Dimensions.get('window').width;

export default class InfoItem extends Component {
    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                {
                    this.props.datasource.map((item, index) => {
                        return (
                            // <TouchableOpacity key={index} onPress={() => this.props.onPress(index)}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: (ScreenWidth - 20) / 3, width: (ScreenWidth - 20) / 3 }}>
                                <EntranceItem subtitle={item.subtitle} title={item.title} />
                            </View>
                            // </TouchableOpacity>
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
            <View style={{ alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: px2dp(35), color: '#000000' }}>{this.props.title}</Text>
                <Text style={{ textAlign: 'center', marginTop: px2dp(15), fontSize: px2dp(30), color: 'gray' }}>{this.props.subtitle}</Text>
            </View>
        );
    }
}
