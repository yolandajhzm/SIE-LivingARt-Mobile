import React from 'react';
import{ StyleSheet, View, Button, Text, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { callApi } from '../services/api';
import colors from '../config/colors';


function AccountScreen({ route, navigation }) {

    const { userId } = route.params;

    const handleSignOut = () => {
        navigation.navigate('Welcome');
    };

    {/* Nav Bar */}
    const initialLayout = {width: Dimensions.get('window').width};

    const AccountRoute = () => (
        <View style={[styles.routeContainer]}>
            <TouchableOpacity style={styles.button} onPress={handleSignOut} >
               <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
    
    // Nav Bar
    const renderTabBar = (props) => (
      <TabBar
        {...props}
        style={styles.tabBar}
        labelStyle={styles.labelStyle}
        tabStyle={styles.tabStyle}
        scrollEnabled={true}
        indicatorStyle={styles.indicatorStyle}
      />
    );
    
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: 'account', title: 'My account'},
    ]);

    const renderScene = SceneMap({
        account: AccountRoute,
    });

   
    return (
        <SafeAreaView style={styles.container}>
            {/* header view */}
            <View style={styles.headerView}>
                <View style={styles.appNameContainer}>
                    <Image source={require('../assets/NameOnly.png')} style={styles.appName} />
                </View>
                <View style={styles.displayViewContainer}>
                    <TabView
                        style={styles.tabView}
                        navigationState={{index, routes}}
                        renderTabBar={renderTabBar}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={initialLayout}
                    />
                </View>
            </View>
            {/* footer view */}
            <View style={styles.footerView}>
                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Home', { userId })} >
                        <AntDesign name="home" size={25} color={colors.lightgray}  />
                        <Text style={styles.iconName} color={colors.lightgray}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Wishlist', { userId })} >
                        <Entypo name="heart-outlined" size={25} color={colors.lightgray}  />
                        <Text style={styles.iconName} color={colors.lightgray}>Wishlist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => {} } >
                        <AntDesign name="user" size={25} color={colors.darkgray} />
                        <Text style={styles.iconName} color={colors.lightgray}>Me</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    appName: {
        width: 180, 
        height: 30, 
        top:10
    },
    appNameContainer: {
        flex: 0.4, 
        alignItems: 'center'
    },
    button: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: colors.darkgray,
        borderWidth: 2,
        borderRadius: 20,
        width: "50%",
        height: "8%",
        position: "absolute",
        top: "10%",
    },
    buttonText: {
        fontSize: 15,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: colors.darkgray,
    },
    container: {
        flex: 1, 
        backgroundColor: colors.white
    },
    displayViewContainer: {
        flex: 5.9
    },
    footerContainer: {
        flex: 1, 
        flexDirection: 'row', 
        borderTopColor: colors.lightgray, 
        borderTopWidth: 1
    },
    footerView: {
        flex: 0.3
    },
    headerView: {
        flex: 6.3
    },
    iconContainer: {
        flex: 1, 
        top: 10, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    iconName: {
        fontSize: 12, 
        top: 5, 
    },
    indicatorStyle: {
        backgroundColor: colors.darkgray, 
        height: 5, 
        borderRadius: 10
    },
    labelStyle: {
        color: colors.darkgray, 
        fontSize: 12, 
        fontWeight: 'bold'
    },
    routeContainer: {
        flex: 4.9,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBar: {
        backgroundColor: colors.white, 
        borderBottomColor: colors.lightgray, 
        borderBottomWidth: 1
    },
    tabStyle: {
        width: 120
    },
    tabView: {
        flex: 1
    },
    title: {
        position: 'absolute',
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        left: '12%',
        color: colors.darkgray,
        width: '100%',
    },
})


export default AccountScreen;