import React, { Component } from 'react';
import { Dimensions, ImageBackground, Image, Text, TouchableOpacity, View } from "react-native";
import { px2dp } from '../.././global/Utils'

const ScreenWidth = Dimensions.get('window').width;

// 平台推荐
export default class HomeHotItem extends Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                    this.props.datasource.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => this.props.onPress(index)}>
                                <View style={{ justifyContent: 'center', height: 85, width: ScreenWidth }}>
                                    <PlatformItem image={item.image} title={item.title} subtitle={item.subtitle} subdestitle={item.subdestitle} is_hot={item.is_hot} requirement={item.requirement} />
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
    constructor(props) {
        super(props);
        this.state = {

            banners: []
        };
    };
    componentWillMount() {

    }

    reanDTagView() {

        this.banners = this.props.requirement.split(' ');
        if (this.banners.length == 1) {

            return (
                <View style={{ backgroundColor: '#F2F7FF', marginLeft: 8, height: 20, marginTop: 10, justifyContent: "center", alignItems: 'center', borderRadius: 5 }}>
                    <Text style={{ paddingLeft: 5, paddingRight: 5, height: 20, top: 4.5, fontSize: 10, justifyContent: "center", color: '#a3bee4', borderRadius: 15 }}>{this.banners[0]}</Text>

                </View>
            )


        } else if (this.banners.length == 2) {

            return (
                <View style={{ flexDirection: 'row' }} >
                    <View style={{ backgroundColor: '#F2F7FF', marginLeft: 8, height: 20, marginTop: 10, justifyContent: "center", alignItems: 'center', borderRadius: 5 }}>
                        <Text style={{ paddingLeft: 5, paddingRight: 5, height: 20, top: 4.5, fontSize: 10, justifyContent: "center", color: '#a3bee4', borderRadius: 15 }}>{this.banners[0]}</Text>
                    </View>
                    <View style={{ backgroundColor: '#F2F7FF', marginLeft: 8, height: 20, marginTop: 10, justifyContent: "center", alignItems: 'center', borderRadius: 5 }}>
                        <Text style={{ paddingLeft: 5, paddingRight: 5, height: 20, top: 4.5, fontSize: 10, justifyContent: "center", color: '#a3bee4', borderRadius: 15 }}>{this.banners[1]}</Text>
                    </View>

                </View>

            )

        } else if (this.banners.length == 3) {

            return (
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ backgroundColor: '#F2F7FF', marginLeft: 8, height: 20, marginTop: 10, justifyContent: "center", alignItems: 'center', borderRadius: 5 }}>
                        <Text style={{ paddingLeft: 5, paddingRight: 5, height: 20, top: 4.5, fontSize: 10, justifyContent: "center", color: '#a3bee4', borderRadius: 15 }}>{this.banners[0]}</Text>
                    </View>
                    <View style={{ backgroundColor: '#F2F7FF', marginLeft: 8, height: 20, marginTop: 10, justifyContent: "center", alignItems: 'center', borderRadius: 5 }}>
                        <Text style={{ paddingLeft: 5, paddingRight: 5, height: 20, top: 4.5, fontSize: 10, justifyContent: "center", color: '#a3bee4', borderRadius: 15 }}>{this.banners[1]}</Text>
                    </View>
                    <View style={{ backgroundColor: '#F2F7FF', marginLeft: 8, height: 20, marginTop: 10, justifyContent: "center", alignItems: 'center', borderRadius: 5 }}>
                        <Text style={{ paddingLeft: 5, paddingRight: 5, height: 20, top: 4.5, fontSize: 10, justifyContent: "center", color: '#a3bee4', borderRadius: 15 }}>{this.banners[2]}</Text>
                    </View>

                </View>
            )
        } else {
            return (
                null
            )
        }
    }



    render() {
        return (
            <View style={{ flexDirection: 'row', borderColor: '#FF3648', alignItems: 'center', marginLeft: px2dp(40) }}>
                <Image style={{ resizeMode: 'stretch', height: px2dp(80), width: px2dp(80), paddingTop: px2dp(5), borderRadius: 5, marginRight: 12 }}
                    source={{ uri: this.props.image }} />
                <View>


                    <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: px2dp(7) }}>
                        <View style={{ flexDirection: 'row', marginTop: 0, marginLeft: 0 }}>

                            <Text style={{ fontSize: px2dp(27), marginTop: 10, color: '#000000', fontWeight: 'bold' }}>{this.props.title}  </Text>

                            <Image style={{ height: px2dp(27), width: px2dp(27), marginTop: 10, marginLeft: 5 }}
                                source={this.props.is_hot === true ? require('../.././assets/home_hot_v1.png') : null} />
                            {
                                this.reanDTagView()
                            }

                        </View>



                    </View>



                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ width: 150, paddingLeft: 0, flexDirection: 'column' }}>
                            <Text style={{ fontSize: px2dp(24), color: '#ff9938', fontWeight: 'bold' }}>{this.props.subtitle}</Text>
                            <Text numberOfLines={2} style={{ fontSize: px2dp(20), marginTop: 8, width: px2dp(200), color: '#bababa', fontWeight: 'bold' }}>{this.props.subdestitle}</Text>

                        </View>

                        <View style={{ right: 10, justifyContent: 'center' }}>

                            <ImageBackground style={{ marginLeft: 60, height: 30, right: 20, justifyContent: "center", alignItems: 'center', width: 90.2 }} source={require('../.././assets/home_get_v1.png')}>
                                <Text style={{ left: 10, width: 80, justifyContent: 'flex-start', color: '#ff9938' }}>立即领钱</Text>
                            </ImageBackground>

                        </View>
                    </View>


                </View>

            </View>
        );
    }
}
