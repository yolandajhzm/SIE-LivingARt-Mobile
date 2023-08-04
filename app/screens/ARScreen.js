import React from 'react';
import {View, Text} from 'react-native';

function ARScreen({navigation}) {
  return (
    <View>
      <Text>AR Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  controlsView: {
    width: '100%',
    height: 100,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFFFE0',
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 20,
  },
});

export default ARScreen;
