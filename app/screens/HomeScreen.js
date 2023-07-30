import React, { useState, useEffect, useMemo } from 'react';
import{ StyleSheet, View, FlatList, Text, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useFocusEffect } from '@react-navigation/native';

import { callApi } from '../services/api';
import colors from '../config/colors';
import APIConfig from '../config/APIConfig';

function HomeScreen({ route, navigation }) {

    {/* Nav Bar */}
    const initialLayout = {width: Dimensions.get('window').width};
    const { userId } = route.params;

    function routeTemplate({data}) {
        return (
            <View style={[styles.routeContainer]}>
                <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        numColumns={2}
                />
            </View>
        );
    }

    const AllRoute = () => (
        routeTemplate({data: allData})
    );
    const ChairRoute = () => (
        routeTemplate({data: chairData})
    );
    const TableRoute = () => (
        routeTemplate({data: tableData})
    );
    const SofaRoute = () => (
        routeTemplate({data: sofaData})
    );
    const LampRoute = () => (
        routeTemplate({data: lampData})
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
        {key: 'all', title: 'All'},
        {key: 'chair', title: 'Chair'},
        {key: 'table', title: 'Table'},
        {key: 'sofa', title: 'Sofa'},
        {key: 'lamp', title: 'Lamp'},
    ]);

    const renderScene = SceneMap({
        all: AllRoute,
        chair: ChairRoute,
        table: TableRoute,
        sofa: SofaRoute,
        lamp: LampRoute,
    });

    {/* Item List */}
    const [allData, setAllData] = useState([]); 
    const [chairData, setChairData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [sofaData, setSofaData] = useState([]);
    const [lampData, setLampData] = useState([]);

    const [wishList, setWishList] = useState([]);

    {/* TODO: replace dummy data with data from database */}
    useFocusEffect(
        React.useCallback(() => {
            const fetchFurniture = async () => {
                try {
                const data = await callApi(APIConfig.GET_ALL_FURNITURE);
                setAllData(data.page.list);
                } catch (error) {
                console.error(error);
                }
            };
            
            fetchFurniture();
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

            // setAllData(dummyData);

            

            const fetchWishlist = async () => {
                try {
                const data = await callApi(`${APIConfig.GET_WISHLIST}/${userId}`);
                setWishList(data.favorite_list);
                } catch (error) {
                console.error(error);
                }
            };
            
            fetchWishlist();
        }, [])
    );

    useEffect(() => {
        let chairItems = [];
        let tableItems = [];
        let sofaItems = [];
        let lampItems = [];

        for(let i = 0; i < allData.length; i++) {
            switch(allData[i].type) {
                case 'chair':
                    chairItems.push(allData[i]);
                    break;
                case 'table':
                    tableItems.push(allData[i]);
                    break;
                case 'sofa':
                    sofaItems.push(allData[i]);
                    break;
                case 'lamp':
                    lampItems.push(allData[i]);
                    break;
                default:
                    break;
            }
        }

        setChairData(chairItems);
        setTableData(tableItems);
        setSofaData(sofaItems);
        setLampData(lampItems);
    }, [allData]);

    const handleWishList = async (item) => {
        try {
            const responseData = await callApi(APIConfig.UPDATE_WISHLIST, 'POST', {
                userId: userId,
                furnitureId: item.id,
            });
            if (responseData.code === 0) {
                const isItemInWishlist = wishList.some((wishlistItem) => wishlistItem.id === item.id);
                if (isItemInWishlist) {
                    setWishList(wishList.filter((wishlistItem) => wishlistItem.id !== item.id));
                } else {
                    setWishList([...wishList, item]);
                }

            } else {
                console.error('Failed to update wishlist status:', responseData.msg);
            }
        } catch (error) {
        console.error('Error updating wishlist status:', error);
        } 
    };

    // each item square
    //source={{ uri: imageSource }}
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Detail', { item: item, userId: userId })}>
            <Image source={ { uri: item.imageSource } } style={styles.image} /> 
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <TouchableOpacity style={styles.wishListIcon} onPress={() => handleWishList(item)} > 
                    <Entypo name= {wishList.some((wishlistItem) => wishlistItem.id === item.id) ? "heart" : "heart-outlined"} size={17} color={wishList.some((wishlistItem) => wishlistItem.id === item.id) ? colors.red : colors.lightgray} />
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
                    <TouchableOpacity style={styles.iconContainer} onPress={() => {}} >
                        <AntDesign name="home" size={25} color={colors.darkgray}  />
                        <Text style={styles.iconName} color={colors.darkgray}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Wishlist', { userId })} >
                        <Entypo name="heart-outlined" size={25} color={colors.lightgray}  />
                        <Text style={styles.iconName} color={colors.lightgray}>Wishlist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Account', { userId })} > 
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

export default HomeScreen;