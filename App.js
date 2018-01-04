import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import ProgressButton from './src/ProgressButton';
import HeartButton from './src/HeartButton';
import CollapsibleHeader from './src/CollapsibleHeader';
import MultiScreen from './src/MultiScreen';

//TODO: create Google chrome inspired navigator
//TODO: work on SpaceView component

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

const rgb = () => {
    return `rgb(${randInt(0, 255)}, ${randInt(0, 255)}, ${randInt(0, 255)})`;
};

class Test extends Component {
    componentWillMount() {
        console.log('will mount');
    }
    componentWillUnmount() {
        console.log('will unmount');
    }
    render() {
        return <View {...this.props} />;
    }
}

class Header extends Component {
    render() {
        return (
            <View style={styles.header}>
                <Button style={{ flex: 1 }} title="Back" onPress={() => this.props.nav.back()} />
                <View style={{ height: 50, flex: 1 }}>
                    <Text style={{ fontSize: 30, color: 'white' }}>{this.props.nav.headerTitle}</Text>
                </View>
                <Button
                    style={{ flex: 1 }}
                    title="go to end"
                    onPress={() => this.props.nav.goToIndex(this.props.nav.lastIndex)}
                />
            </View>
        );
    }
}

export default class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <MultiScreen keepMounted={true} header={<Header />}>
                    <Test
                        headerTitle="Home"
                        screenName="Home"
                        key={`${randInt(0, 1000)}-${randInt(0, 1000)}`}
                        style={[styles.mockScreen, { backgroundColor: rgb() }]}
                    />
                    <Test
                        screenName="theWay"
                        headerTitle="Screen Two"
                        key={`${randInt(0, 1000)}-${randInt(0, 1000)}`}
                        style={[styles.mockScreen, { backgroundColor: rgb() }]}
                    />
                    <Test
                        headerTitle="Screen three"
                        key={`${randInt(0, 1000)}-${randInt(0, 1000)}`}
                        style={[styles.mockScreen, { backgroundColor: rgb() }]}
                    />
                    <Test
                        key={`${randInt(0, 1000)}-${randInt(0, 1000)}`}
                        style={[styles.mockScreen, { backgroundColor: rgb() }]}
                    />
                </MultiScreen>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        paddingTop: 20,
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    mockScreen: {
        height: '100%',
        width: '100%'
    },
    header: {
        height: 50,
        backgroundColor: 'rgb(42, 99, 245)',
        width: '100%',
        flexDirection: 'row'
    }
});
