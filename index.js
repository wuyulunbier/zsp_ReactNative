/**
 * @format
 */

 import React from 'react'
import {AppRegistry,PermissionsAndroid,Platform} from 'react-native';
import {name as appName} from './app.json';
import {AppNavigator} from './js/Navigator'
import codePush from 'react-native-code-push'
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';
import {init, Geolocation} from 'react-native-amap-geolocation'

codePush.sync()

let storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
});
global.storage = storage;

//class App extends React.Component{

    

    // async componentDidMount() {
    //     alert('000');
    //     if (Platform.OS === "android") {
    //       await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
    //     }
    //     await init({
    //       ios: "a7351c26e8cf75892ebe2965b3c9e050",
    //       android: "4354119fc67308e731a3b5ee58adf858"
    //     });

    //     Geolocation.getCurrentPosition(({ coords }) => {
    //         alert('11');
    //       });
    //   }

//           componentWillUnmount() {
//             stop();
//           }

//           updateLocationState(location) {
//             if (location) {
//               location.updateTime = new Date().toLocaleString();
//               this.setState({ location });
//               console.log(location);
//             }
//           }

// }



AppRegistry.registerComponent(appName, () => AppNavigator);