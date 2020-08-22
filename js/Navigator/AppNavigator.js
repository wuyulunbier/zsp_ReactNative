import React from 'react';
import { TouchableOpacity, View, Image, Platform, StatusBar, StyleSheet, Text } from 'react-native';
import { createAppContainer, createStackNavigator, CashLoan, createBottomTabNavigator } from 'react-navigation';

import { Login, Register, VerifyLogin, ForgetPassword, HomePage, Business, UserCenter, ContactUs, ShowWeb } from '../Pages';
import LoanDetail from '../Pages/LoanDetail';
import CashPage from '../Pages/CashLoan';
import { Http, API } from "../Request";
import { UserInfo, deviceId } from '../../global';
import ShowCity from '../Pages/ShowCity';
import LocationEmpty from '../Pages/LocationEmpty';
import LocationProduct from '../Pages/LocationProduct';




const bottomTabNavigator = createBottomTabNavigator(
    {

        HomePage: {
            screen: HomePage,
            navigationOptions: {
                tabBarLabel: "首页",
                tabBarIcon: ({ tintColor, focused }) => (
                    <Image style={{ width: 24, height: 24, tintColor: tintColor }}
                        source={focused ? require('../.././assets/main_blue.png') : require('../.././assets/main_white.png')} />
                ),

            },
        },
        CashLoan: {
            screen: CashPage,
            navigationOptions: {
                tabBarLabel: "贷款",

                tabBarIcon: ({ tintColor, focused }) => (
                    <Image style={{ width: 24, height: 24, tintColor: tintColor }}
                        source={focused ? require('../.././assets/loan_blue.png') : require('../.././assets/loan_white.png')} />
                ),
            },
        },
        UserCenter: {
            screen: UserCenter,
            navigationOptions: {
                tabBarLabel: "我的",
                tabBarIcon: ({ tintColor, focused }) => (
                    <Image style={{ width: 24, height: 24, tintColor: tintColor }}
                        source={focused ? require('../.././assets/mine_blue.png') : require('../.././assets/mine_white.png')} />
                ),
            }
        },
    },

    {
        initialRouteName: "HomePage",
        lazy: true,
        tabBarOptions: {
            inactiveTintColor: "#8F8F8F",
            activeTintColor: "#3F65FF",
            labelStyle: {
                fontSize: 11
            }
        }
    },
);

bottomTabNavigator.navigationOptions = ({ navigation }) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let config = {
        headerTitle: (routeName === 'HomePage' ? '助贷超市' : routeName === 'UserCenter' ? '账户' : '贷款'),
    };
    if (routeName === "HomePage") {
        config["header"] = null
    }
    return config
};

const AppNavigator = createStackNavigator(
    {

        Main: {
            screen: bottomTabNavigator,
            navigationOptions: ({ navigation }) => ({
                headerLeft: null,
                headerRight: null,
            })
        },

        Login: {
            screen: Login,
            navigationOptions: ({ navigation }) => ({
                title: '登录',
                headerLeft: (<TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { navigation.popToTop() }}>
                    <Image source={require('../.././assets/cancel.png')} />
                </TouchableOpacity>),
                headerRight: <Text />,
            })
        },
        Register: {
            screen: Register,
            navigationOptions: ({ navigation }) => ({
                title: '注册',
            })
        },

        VerifyLogin: {
            screen: VerifyLogin,

            navigationOptions: ({ navigation }) => ({
                title: '登录',
                gesturesEnabled: false,
                //      header:null,
                headerLeft: (<TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { }}>

                </TouchableOpacity>),
                // headerRight: <Text/>,
            })
        },
        ForgetPassword: {
            screen: ForgetPassword,
            navigationOptions: ({ navigation }) => ({
                title: '忘记密码',
            })
        },

        ShowCity: {
            screen: ShowCity,
            navigationOptions: ({ navigation }) => ({
                header: null,
                gesturesEnabled: false,
            })
        },
        LocationEmpty: {
            screen: LocationEmpty,
            navigationOptions: ({ navigation }) => ({
                header: null,
                gesturesEnabled: false,
            })
        },


        Business: {
            screen: Business,
            navigationOptions: ({ navigation }) => ({
                title: navigation.getParam('title', ''),
            })
        },
        ContactUs: {
            screen: ContactUs,
            navigationOptions: ({ navigation }) => ({
                title: '联系我们',
            })
        },
        ShowWeb: {
            screen: ShowWeb,
            navigationOptions: ({ navigation }) => ({
                headerRight: (<View />),
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1,
                    fontSize: 15
                }

            })

        },

        CashLoan: {
            screen: CashPage,
            navigationOptions: ({ navigation }) => ({
                title: '产品列表',
            })
        },
        LoanDetail: {
            screen: LoanDetail,
            navigationOptions: ({ navigation }) => ({
                title: '贷款详情',
            })

        },
        LocationProduct: {
            screen: LocationProduct,
            navigationOptions: ({ navigation }) => ({
                header: null,
                gesturesEnabled: false,
            })
        }

    },

    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                flex: 1,
                textAlign: 'center',
                fontSize: 17,
                fontWeight: 'normal',
            },
            headerStyle: {
                backgroundColor: 'white',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomColor: 'transparent',
            },
            headerLeft: (<TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { navigation.pop() }}>
                <Image source={require('../.././assets/back.png')} />
            </TouchableOpacity>),
            headerRight: <Text />,
        })
    }
);

const styles = StyleSheet.create({
    tabBarIconStyle: {
        width: 30,
        height: 30,
    },
});

export default createAppContainer(AppNavigator);

