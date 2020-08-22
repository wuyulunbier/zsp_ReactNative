import React, { Component } from 'react';
import { AppRegistry, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { px2dp } from '../.././global/Utils'

export default class Greeting extends Component {
    render() {
        return (

            <TouchableOpacity key={index} onPress={() => this.props.onPress()}>
                <Text style={{ fontSize: px2dp(100), color: '#ceced2', fontWeight: 'bold' }}>heloo llll</Text>
            </TouchableOpacity>



            // <view style={{height:px2dp(200)}}>

            //    <text style={{fontSize:px2dp(100),color:'#ceced2'}}>uuuuu</text>
            // </view>

        )

    }
}

