import React, { Component } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { px2dp } from '../.././global/Utils'

const ScreenWidth = Dimensions.get('window').width;

// 贷款申请
export default class CashApply extends Component {
    render() {
        return (
            <Text style={{ fontSize: px2dp(25), color: '#ceced2', fontWeight: 'bold' }}>rttttt</Text>
        )

    }
}

