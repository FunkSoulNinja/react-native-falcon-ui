import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Animated, StatusBar } from 'react-native';

import MultiScreen from './src/MultiScreen';

class Test extends Component {
    componentWillMount() {
        // console.log('mount');
    }
    componentWillUnmount() {
        // console.log('unmount');
    }
    render = () => <View {...this.props} />;
}

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <MultiScreen>
                    <Test style={[styles.screen, { backgroundColor: 'rgb(147, 161, 179)' }]} />
                    <Test style={[styles.screen, { backgroundColor: 'rgb(146, 179, 153)' }]} />
                    <Test style={[styles.screen, { backgroundColor: 'rgb(171, 146, 179)' }]} />
                    <Test style={[styles.screen, { backgroundColor: 'rgb(179, 165, 145)' }]} />
                    <Test style={[styles.screen, { backgroundColor: 'rgb(145, 148, 179)' }]} />
                    <Test style={[styles.screen, { backgroundColor: 'rgb(147, 161, 179)' }]} />
                    <Test style={[styles.screen, { backgroundColor: 'rgb(146, 179, 153)' }]} />
                    <Test style={[styles.screen, { backgroundColor: 'rgb(171, 146, 179)' }]} />
                    <Test style={[styles.screen, { backgroundColor: 'rgb(179, 165, 145)' }]} />
                    <Test style={[styles.screen, { backgroundColor: 'rgb(145, 148, 179)' }]} />
                </MultiScreen>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 20,
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    screen: {
        width: '100%',
        height: '100%'
    }
});
