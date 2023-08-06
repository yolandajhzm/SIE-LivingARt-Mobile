import React, { useState } from 'react';
import  { View, Text, Button, Switch, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';
import  FloatingLabel  from 'react-native-floating-labels';
import Entypo from 'react-native-vector-icons/Entypo';

import colors from '../config/colors';
import { callApi } from '../services/api';
import APIConfig from '../config/APIConfig';

function RegisterScreen ({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isVendor, setIsVendor] = useState(false);

    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  
    const handleSignUp = async () => {
        if (!email || !email.match(isValidEmail)) {
            alert('Please enter a valid email address');
            return;
        }
        if (!password || password.length < 6) {
            alert('Please enter a valid password (min. 6 characters)');
            return;
        }
        if (!confirmPassword || password !== confirmPassword) {
            alert('Please confirm your password');
            return;
        }
        // register user
        const responseData = await callApi(APIConfig.REGISTER_USER, 'POST', { 
            email: email,
            password: password,
            type: isVendor ? 1 : 0, 
        })

        // handle response
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
            if (responseData.code === 0) { 
                handleLogin();
            } else {
                alert(responseData.msg);
                console.error("Sign up failed");
            }
        }, 1);
    };  

    const handleLogin = () => {
        // navigate to login screen
        navigation.navigate('Login');
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
                    <View >
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
                    <View >
                        <FloatingLabel  
                            key={showConfirmPassword.toString()}
                            labelStyle={styles.labelInput}
                            inputStyle={styles.inputStyle}
                            style={styles.formInput}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        >Confirm Password</FloatingLabel>
                        <Entypo 
                            name={showConfirmPassword ? 'eye-with-line' : 'eye'} 
                            size={20} 
                            style={styles.icon} 
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                        />
                    </View>
                    <View style={styles.vendorSelection}>
                        <Text 
                            style={styles.switchText}
                        >Are you a vendor?</Text>
                        <Switch
                            trackColor={{ false: colors.white, true: colors.darkgray }}
                            thumbColor={colors.white}
                            ios_backgroundColor= {colors.white}
                            style={styles.switch}
                            onValueChange={setIsVendor}
                            value={isVendor}
                        />
                    </View>
                </View>
            </View> 
            {/* buttons */}
            <View style={styles.buttons}>
                <Button
                    title="Sign Up"
                    color={colors.white}
                    onPress={handleSignUp}
                />
                <View>
                    <Text style={styles.haveAccount}>
                        Already have an account?
                        <Text style={styles.login} onPress={handleLogin}>
                            {' '} {/* in order to have a space here */}  
                            Login
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
    formInput: {    
        marginLeft: 20,   
        marginTop: 20, 
    },
    haveAccount: {
        color: colors.darkgray, 
        top: 20, 
        textAlign: 'center'
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
    },
    labelInput: {
        fontSize: 16,
        color: colors.black
    },
    login: {
        color: colors.blue, 
        fontStyle: 'italic'
    },
    loginForm: {
        padding: 40
    },
    logo: {
        width: 100,
        height: 100,
        bottom: "10%"
    },
    switch: {
        position: "absolute",
        right: 0,
        top: 20,
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]

    },
    switchText: {
        color: colors.black,
        fontSize: 16,
        marginTop: 20,
        marginLeft: 25,

    },
    vendorSelection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
      },
  });  

export default RegisterScreen;