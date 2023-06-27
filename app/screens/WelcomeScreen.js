import React from 'react';
import { Text, TouchableOpacity, Image, ImageBackground, StyleSheet, View } from 'react-native';

import colors from '../config/colors';

function WelcomeScreen({ navigation }) {
    // console.log(navigation);

    return (
        <ImageBackground 
            style={styles.background}
            source={require('../assets/background.jpg')}
        >
            <Image 
                style={styles.appName}
                source={require('../assets/name.png')} 
            /> 
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')} >
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')} >
                    <Text style={styles.registerButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    appName: {
        position: "absolute",
        top: "10%",
        left: "13%",
        width: "78%",
        height: "16%"
    },
    background: {
        flex: 1
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    loginButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.white,
        borderRadius: 15,
        width: "80%",
        height: "5%",
        position: "absolute",
        bottom: "15%",
    },
    loginButtonText: {
        fontSize: 15,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: colors.darkgray,
    },
    registerButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.darkgray,
        borderRadius: 15,
        width: "80%",
        height: "5%",
        position: "absolute",
        bottom: "8%",
    },
    registerButtonText: {
        fontSize: 15,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        color: colors.white,
    },
})

export default WelcomeScreen;