import React, { useState } from 'react';
import  { View, Text, Button, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';
import  FloatingLabel  from 'react-native-floating-labels';
import Entypo from 'react-native-vector-icons/Entypo';

import colors from '../config/colors';
import { callApi } from '../services/api';
import APIConfig from '../config/APIConfig';

// TODO: 
// JWT?

function LoginScreen ({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const handleLogin = async() => {
        if (!email) {
            alert('Please fill Email');
            return;
        }
        if (!password) {
            alert('Please fill Password');
            return;
        }
        // login user
        const responseData = await callApi(APIConfig.LOGIN_USER, 'PUT', { 
            email: email,
            password: password,
        })

        // handle response
        setEmail('');
        setPassword('');
        setTimeout(() => {
            if (responseData.code === 0) { 
                const userId = responseData.data.id; 
                console.log("id: " + userId);
                navigation.navigate('Home', { userId });
            } else {
                alert(responseData.msg);
                console.error("Login failed");
            }
        }, 1);
        // navigation.navigate('Home', { userId });
    };

    const handleSignUp = () => {
        // navigate to register screen
        navigation.navigate('Register');
    };
  
    return (
    <View style={styles.container}>
        {/* header view */}
        <ImageBackground
            source={require('../assets/background2.jpg')}
            style={styles.background}>
            <View style={styles.header}>
                <Image 
                    style={styles.logo}
                    source={require('../assets/logo.png')} 
                /> 
                <Image 
                    style={styles.appName}
                    source={require('../assets/NameOnly.png')} 
                /> 
            </View>
        </ImageBackground>

        {/* bottom view */}
        <View style={styles.bottomView}>
            {/* login form */}
            <View style={styles.loginForm}>
                <View>
                    <FloatingLabel  
                        labelStyle={styles.labelInput}
                        inputStyle={styles.inputStyle}
                        style={styles.formInput}
                        value={email}
                        onChangeText={setEmail}
                    >Email</FloatingLabel>
                    <View style={{flex: 1, position: "relative"}}>
                        <FloatingLabel  
                            key={showPassword.toString()}
                            labelStyle={styles.labelInput}
                            inputStyle={styles.inputStyle}
                            style={styles.formInput}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        >Password</FloatingLabel>
                        <Entypo 
                            name={showPassword ? 'eye-with-line' : 'eye'} 
                            size={20} 
                            style={styles.icon} 
                            onPress={() => setShowPassword(!showPassword)} 
                        /> 
                    </View>
                    
                </View>
                {/* TODO: additional feature */}
                {/* <Text style={styles.forgotPw}>
                    Forgot Password?
                </Text> */}
            </View> 
            {/* buttons */}
            <View style={styles.buttons}>
                <Button
                    title="Login"
                    color={colors.white}
                    onPress={handleLogin}
                />
                <View>
                    <Text style={styles.noAccount}>
                        Don't have an account?
                        <Text style={styles.signUp} onPress={handleSignUp}>
                            {' '} {/* in order to have a space here */}  
                            Sign Up
                        </Text> 
                    </Text>
                    
                </View>
            </View>
        </View>
    </View>
      
    );
};

const styles = StyleSheet.create({
    appName: {
        bottom: "10%",
        left: "2%",
        width: "45%",
        height: "8%"
    },
    background: {
        height: Dimensions.get('window').height / 3
    },
    bottomView: {
        flex: 1.5,
        backgroundColor: colors.white,
        bottom: 50,
        borderTopStartRadius: 60,
        borderTopEndRadius: 60
    },
    buttons: {
        position: "absolute",
        bottom: "20%",
        left: "15%",
        right: "15%",
        width: "70%",
        height: "7%",
        borderRadius: 8,
        backgroundColor: colors.darkgray
    },
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    // forgotPw: {
    //     color: colors.blue,
    //     textAlign: 'right',
    //     marginTop: 30,
    //     marginRight: 20
    // },
    formInput: {    
        marginLeft: 20,   
        marginTop: 20, 
    },
    header: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
        color: colors.darkgray, 
        position: "absolute", 
        right: 0, 
        marginTop: 50,
    },
    inputStyle: {
        fontSize: 16,
        borderWidth: 0,
        borderBottomWidth: 1,
        paddingRight: 30,
    },
    labelInput: {
        fontSize: 16,
        color: colors.black
    },
    loginForm: {
        padding: 40
    },
    logo: {
        width: 100,
        height: 100,
        bottom: "10%"
    },
    noAccount: {
        color: colors.darkgray, 
        top: 20, 
        textAlign: 'center'
    },
    signUp: {
        color: colors.blue, 
        fontStyle: 'italic'
    }
  });  

export default LoginScreen;