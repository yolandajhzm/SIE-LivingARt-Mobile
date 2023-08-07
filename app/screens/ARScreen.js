import React from 'react';
import { View, Text } from 'react-native';

function ARScreen({ route, navigation }) {
    const modelURL = route.params.model;
    const dimension = route.params.dimension;
    console.log(model);
    console.log(dimension);
    return (
        <View>
            <Text>AR Screen</Text>
        </View>
    );
}

export default ARScreen;