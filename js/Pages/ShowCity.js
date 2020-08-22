import React, { Component } from "react";
import {
  SafeAreaView,
  Dimensions,
  ProgressViewIOS,
  TouchableOpacity,
  Image,
  View,
  Text,
  Platform,
  BackHandler,
  DeviceEventEmitter
} from "react-native";
import { WebView } from "react-native-webview";

// let WEBVIEW_REF = 'ShowWeb';
let _this = null;
const X_WIDTH = 375;
const X_HEIGHT = 812;
const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get("window");
export default class ShowCity extends Component {
  constructor(props) {
    super(props);
    this.webView = null;
    this.state = {
      title: "",
      canGoBack: false,
      progress: 0,
      mobilePhone: "",
      url: ""
    };
  }

  componentWillMount() {


    this.mobilePhone = this.props.navigation.state.params.token;
    this.url = 'https://cdf.oywj.cn/dsh_page/index.html?token=' + this.mobilePhone;

    if (Platform.OS === "android") {
      this.listener = BackHandler.addEventListener(
        "hardwareBackPress",
        function () {
          return true;
        }
      );
    }

    if (Platform.OS === "android") {
    }
  }

  componentWillUnmount() {
    //获取返回数据
    if (Platform.OS === "android") {
      this.listener.remove("hardwareBackPress");
    }
  }

  componentDidMount() {
    _this = this;
  }

  _onLoadPragress = e => {
    this.setState({
      progress: e.nativeEvent.progress
    });
  };


  _onMessage = (event) => {

    // var res = JSON.parse(e.nativeEvent.data)
  }

  render() {
    return (
      // <WebView  source={{uri: 'https://cdf.oywj.cn/dsh_page/index.html?token=13866850026'}} onMessage={this.onMessage.bind(this)}/>

      <WebView
        ref={(webview) => this.webview = webview}
        // javaScriptEnabled={true}
        // useWebKit={true}



        source={{
          uri: this.url
        }}
        style={{
          marginTop:
            Platform.OS === "android"
              ? 0
              : (D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
                (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT)
                ? 34
                : 24
        }}
        onMessage={(event) => {
          // if(event.nativeEvent.data === '')

          //验证提交成功后的修改状态
          this.props.navigation.popToTop();
          DeviceEventEmitter.emit('refresh', {
            'newMessage': '新消息',

          })


        }}

        // onMessage={(event) => {this._onMessage(event) }}
        onError={e => {
          alert('出现错误');
        }}
      />
    );
  }
}
