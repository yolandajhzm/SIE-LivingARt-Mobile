import React, { useState, useEffect, useMemo } from 'react';
import{ StyleSheet, View, FlatList, Text, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { callApi } from '../services/api';
import colors from '../config/colors';

function WishListScreen({ navigation }) {

    {/* Nav Bar */}
    const initialLayout = {width: Dimensions.get('window').width};

    function WishlistRoute() {
        return (
            <View style={[styles.routeContainer]}>
                <FlatList
                        data={wishList}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        numColumns={2}
                />
            </View>
        );
    }

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
        {key: 'wishlist', title: 'Wishlist'},
    ]);

    const renderScene = SceneMap({
        wishlist: WishlistRoute,
    });

    {/* Item List */}
    const [allData, setAllData] = useState([]); 
    const [wishList, setWishList] = useState([]);

    {/* TODO: replace dummy data with data from database */}
    useEffect(() => {
        // const fetchFurniture = async () => {
        //     try {
        //       const data = await callApi('http://your-api-url/api/furniture');
        //       setAllData(data);
        //     } catch (error) {
        //       console.error(error);
        //     }
        //   };
        
        // fetchFurniture();
        // Dummy data
        const dummyData = [
        {
            id: 1,
            wish: true,
            name: 'Chair 1',
            type: 'chair',
            imageSource: require('../assets/chair.png'),
            description: 'This is a chair This is a chair This is a chair This is a chair This is a chair This is a chair This is a chair This is a chair This is a chair',
        },
        {
            id: 2,
            wish: false,
            name: 'Table 1',
            type: 'table',
            imageSource: require('../assets/table.png'),
            description: 'This is a table',
        },
        {
            id: 3,
            wish: false,
            name: 'Sofa 1',
            type: 'sofa',
            imageSource: require('../assets/sofa.png'),
            description: 'This is a sofa',
        },
        {
            id: 4,
            wish: true,
            name: 'Table 2',
            type: 'table',
            imageSource: require('../assets/table.png'),
            description: 'This is a table',
        },
        {
            id: 5,
            wish: false,
            name: 'Chair 2',
            type: 'chair',
            imageSource: require('../assets/chair.png'),
            description: 'This is a chair',
        },
        ];

        setAllData(dummyData);

        setWishList(dummyData.filter((item) => item.wish === true));
    }, []);

    const handleWishList = (item) => {
        const updatedItem = {  ...item, wish: !item.wish  };
        console.log(updatedItem);
        setAllData(allData.map((dataItem) => dataItem.id === item.id ? updatedItem : dataItem));
        // TODO: update database
    }

    // each item square
    //source={{ uri: imageSource }}
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Detail', {item: item})}>
            <Image source={ item.imageSource } style={styles.image} /> 
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <TouchableOpacity style={styles.wishListIcon} onPress={() => handleWishList(item)} > 
                    <Entypo name= {item.wish ? "heart" : "heart-outlined"} size={17} color={item.wish ? colors.red : colors.lightgray} />
                </TouchableOpacity>
            </View>   
        </TouchableOpacity>
    ); 
   
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
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Home')} >
                        <AntDesign name="home" size={25} color={colors.lightgray}  />
                        <Text style={styles.iconName} color={colors.lightgray}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => {}} >
                        <Entypo name="heart-outlined" size={25} color={colors.darkgray}  />
                        <Text style={styles.iconName} color={colors.darkgray}>Wishlist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Account')} > 
                        <AntDesign name="user" size={25} color={colors.lightgray} />
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
    image: {
        flex: 1,
        width: '80%',
        height: '80%',
        resizeMode: 'cover',
        top: 10,
        borderRadius: 15,
    },
    indicatorStyle: {
        backgroundColor: colors.darkgray, 
        height: 5, 
        borderRadius: 10
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width / 2  , 
        height: Dimensions.get('window').width / 2 , 
        margin: 15,
        backgroundColor: colors.background,
        borderRadius: 10,
    },
    labelStyle: {
        color: colors.darkgray, 
        fontSize: 12, 
        fontWeight: 'bold'
    },
    routeContainer: {
        flex: 4.9,
        padding: 10,
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
    textContainer: {
        flex: 0.25,
        top: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '10%', 
        paddingRight: '10%',
    },
    title: {
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: colors.darkgray,
    },
    wishListIcon: {
        alignItems: 'flex-end', 
    },
})

export default WishListScreen;