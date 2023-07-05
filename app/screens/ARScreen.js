import React from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import { ViroARScene, ViroText, ViroARSceneNavigator, ViroAmbientLight }
    from '@viro-community/react-viro';

const InitialScene = (props) => {
    return (
        <ViroARScene>
            <ViroAmbientLight color="#ffffff" />
            <ViroText text="Happy World" scale={[.5, .5, .5]} position={[0, 0, -1]} />
        </ViroARScene>
    )
}

function ARScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* <Text> AR Screen 2</Text> */}
            <ViroARSceneNavigator
                initialScene={{ scene: InitialScene }}
                style={{ flex: 1 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    }
});

export default ARScreen;