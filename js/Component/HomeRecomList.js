import React, { Component } from 'react';
import { Dimensions, ImageBackground, Image, Text, TouchableOpacity, View } from "react-native";
import { px2dp } from '../.././global/Utils'
import { yellow, gray } from 'ansi-colors';

const ScreenWidth = Dimensions.get('window').width;

// 平台推荐
export default class HomeRecomList extends Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                    this.props.datasource.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => this.props.onPress(index)}>
                                <View style={{ borderColor: 'gray', borderRadius: 10, marginTop: 0, backgroundColor: '', justifyContent: 'center', marginLeft: 20, height: 85, width: ScreenWidth - 40 }}>
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

        this.banners = this.props.subdestitle.split(' ');
        if (this.banners.length == 1) {

            return (
                <View style={{ flexDirection: 'row', marginTop: 3, borderRadius: 5 }}>
                    <View style={{ backgroundColor: '#ECFFED', marginLeft: 20, height: 20, marginTop: 10, justifyContent: "center", alignItems: 'flex-start', borderRadius: 5 }}>
                        <Text style={{ paddingLeft: 5, paddingRight: 5, height: 20, top: 4.5, fontSize: 10, justifyContent: "center", color: '#a3bee4', borderRadius: 15 }}>{this.banners[0]}</Text>

                    </View>
                </View>


            )


        } else if (this.banners.length == 2) {

            return (
                <View style={{ flexDirection: 'row', backgroundColor: '', marginTop: 3 }} >
                    <View style={{ backgroundColor: '#ECFFED', marginLeft: 20, height: 20, marginTop: 10, justifyContent: "center", alignItems: 'center', borderRadius: 5 }}>
                        <Text style={{ paddingLeft: 5, paddingRight: 5, height: 20, top: 4.5, fontSize: 10, justifyContent: "center", color: '#a3bee4', borderRadius: 15 }}>{this.banners[0]}</Text>
                    </View>
                    <View style={{ backgroundColor: '#F2F7FF', marginLeft: 8, height: 20, marginTop: 10, justifyContent: "center", alignItems: 'center', borderRadius: 5 }}>
                        <Text style={{ paddingLeft: 5, paddingRight: 5, height: 20, top: 4.5, fontSize: 10, justifyContent: "center", color: '#a3bee4', borderRadius: 15 }}>{this.banners[1]}</Text>
                    </View>

                </View>

            )

        } else if (this.banners.length == 3) {

            return (
                <View style={{ flexDirection: 'row', marginTop: 3 }}>

                    <View style={{ backgroundColor: '#ECFFED', marginLeft: 20, height: 20, marginTop: 10, justifyContent: "center", alignItems: 'center', borderRadius: 5 }}>
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



            <View style={{ flexDirection: 'row', flex: 1, backgroundColor: "#F4F3F4" }}>

                <View style={{ backgroundColor: '#ffffff', flex: 0.35, flexDirection: 'column', height: 83 }}>
                    <Text numberOfLines={1} style={{ color: '#f03a4a', paddingLeft: 15, fontSize: 17, textAlign: 'left', paddingTop: 16 }}>{this.props.subtitle}</Text>
                    <Text style={{ paddingTop: 15, color: '#a8a8a8', textAlign: 'center' }}>最高可借 (元)</Text>


                </View>

                <View style={{ flex: 0.1, alignItems: 'center', height: 83, backgroundColor: '#ffffff' }}>

                    <Image style={{ resizeMode: 'stretch', backgroundColor: '#ffffff', marginTop: 20, height: 40, width: 20 }}
                        source={require('../.././assets/item_center.png')} />
                </View>

                <View style={{ flex: 0.55, flexDirection: 'column', backgroundColor: '#ffffff', height: 83 }}>


                    <View style={{ flexDirection: 'row', paddingTop: 13, backgroundColor: '#ffffff' }}>
                        <Image style={{ resizeMode: 'stretch', height: px2dp(50), width: px2dp(50), marginLeft: 20, paddingTop: px2dp(5), borderRadius: 5, marginRight: 12 }}
                            source={{ uri: this.props.image }} />

                        <Text style={{ paddingTop: 5, textAlign: 'center', height: px2dp(50) }}>{this.props.title}</Text>
                    </View>

                    {
                        this.reanDTagView()
                    }
                </View>




            </View>


        );
    }
}
