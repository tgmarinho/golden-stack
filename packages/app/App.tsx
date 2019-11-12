import React from 'react';
import {SafeAreaView, StyleSheet, Text, StatusBar} from 'react-native';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text style={styles.text}>Step One</Text>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
});

export default App;
