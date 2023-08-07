import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';

function DetailScreen({route, navigation}) {
  const item = route.params.item;
  const userId = route.params.userId;
  const {name, imageSource, description, threeModels} = item;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image source={{uri: item.imageSource}} style={styles.image} />
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text
            style={styles.description}
            numberOfLines={5}
            ellipsizeMode="tail">
            {description}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AR', {threeModels})}>
            <MaterialCommunityIcons
              name="rotate-3d"
              size={24}
              style={styles.camera}
            />
            <Text style={styles.buttonText}>View in AR</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footerView}>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('Home', {userId})}>
            <AntDesign name="home" size={25} color={colors.lightgray} />
            <Text style={styles.iconName} color={colors.lightgray}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('Wishlist', {userId})}>
            <Entypo name="heart-outlined" size={25} color={colors.lightgray} />
            <Text style={styles.iconName} color={colors.lightgray}>
              Wishlist
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('Account', {userId})}>
            <AntDesign name="user" size={25} color={colors.lightgray} />
            <Text style={styles.iconName} color={colors.lightgray}>
              Me
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.darkgray,
    borderWidth: 2,
    borderRadius: 20,
    width: '50%',
    height: '50%',
    position: 'absolute',
  },
  buttonContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: colors.darkgray,
    paddingLeft: 15,
  },
  camera: {
    color: colors.darkgray,
    position: 'absolute',
    left: '10%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  detailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 15,
    fontFamily: 'Avenir',
    color: colors.gray,
    width: '80%',
    marginTop: 10,
    textAlign: 'center',
  },
  name: {
    fontSize: 25,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: colors.darkgray,
    position: 'absolute',
    top: '5%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageContainer: {
    flex: 3.5,
  },
  itemContainer: {
    flex: 6.6,
    backgroundColor: colors.white,
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    borderTopColor: colors.lightgray,
    borderTopWidth: 1,
  },
  footerView: {
    flex: 0.3,
  },
  iconContainer: {
    flex: 1,
    top: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconName: {
    fontSize: 12,
    top: 5,
  },
});

export default DetailScreen;
