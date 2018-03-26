import React, { Component } from 'react';
import {
    Button, StyleSheet,
    Text,
    View
} from 'react-native';
import BlockExplorer from "../components/BlockExplorer";

class U2U extends React.Component{
    static navigationOptions = {
        title: 'U2U',
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.root}>
            </View>
        );
    }
}
export default U2U;

const styles=StyleSheet.create({
        root:{
            flex:1,
        }
    }
)