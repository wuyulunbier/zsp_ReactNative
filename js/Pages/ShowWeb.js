import React, { Component } from "react";
import { SafeAreaView, ProgressViewIOS, TouchableOpacity, Image, Text, Platform, BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import { Linking } from "react-native";

let WEBVIEW_REF = 'ShowWeb';
let _this = null;

export default class ShowWeb extends Component {
    static navigationOptions = ({ navigationOptions, navigation }) => {
        return {

            title: navigation.getParam('title', ''),

            headerLeft:
                <TouchableOpacity onPress={() => {
                    if (navigation.getParam('canGoBack', false)) {
                        _this.refs[WEBVIEW_REF].goBack();
                    } else {
                        navigation.pop();
                    }
                }}>
                    <Image style={{ marginLeft: 10 }}
                        source={require('../.././assets/back.png')} />
                </TouchableOpacity>,
            headerRight: navigation.getParam('canGoBack', false) ? <Text /> : null,
            gesturesEnabled: false
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            canGoBack: false,
            progress: 0,
        };
    };

    componentWillMount() {
        if (Platform.OS === 'android') {
            this.listener = BackHandler.addEventListener('hardwareBackPress', function () {
                return true;
            });
        }

        if (Platform.OS === 'android') {

        }

    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            this.listener.remove('hardwareBackPress');
        }
    }

    componentDidMount() {
        _this = this;
    };

    _onLoadPragress = (e) => {
        this.setState({
            progress: e.nativeEvent.progress,
        });
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this.state.progress === 1 ? null : <ProgressViewIOS progress={this.state.progress} progressTintColor={'red'} trackTintColor={'white'} style={{ height: 1 }} />}
                <WebView
                    ref={WEBVIEW_REF}
                    source={{ uri: this.props.navigation.getParam('url', '') }}
                    onLoadProgress={this._onLoadPragress}
                    mixedContentMode='compatibility'
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowFileAccess={true}
                    allowUniversalAccessFromFileURLs={true}

                    onShouldStartLoadWithRequest={(addr => {

                        const url = new RegExp("^https*:\/\/")
                        if (!url.test(addr.url)) {
                            Linking.openURL(addr.url)
                            return false
                        }
                        if (/\.(apk|plist)/.test(addr.url)) {
                            Linking.openURL(addr.url)
                            return false
                        }
                        return true;
                    })}


                    onLoadEnd={syntheticEvent => {
                        console.log(syntheticEvent.nativeEvent.canGoBack);
                        this.props.navigation.setParams({ canGoBack: syntheticEvent.nativeEvent.canGoBack });
                        if (Platform.OS === 'android' && Platform.Version >= 8.0) {
                            this.props.navigation.setParams({ canGoBack: false });
                        }
                    }}
                />
            </SafeAreaView>
        );
    }
}
