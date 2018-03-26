import React,{Component} from 'react';
import {
    View,FlatList,Text,StyleSheet
}from 'react-native';
import DefaultConfig from "../DefaultConfig";
import {Apis} from "bitsharesjs-ws";

export default class BlockExplorer extends React.Component{

    state={
        txt:['1','1']
    }

    componentDidMount(){
        Apis.instance(DefaultConfig.server, true).init_promise.then((res) => {
            Apis.instance().db_api().exec('subscribe_to_market', [this.show,'1.3.113','1.3.0']);
        });
    }
    show=(obj)=>{
        var text=JSON.stringify(obj);
        var {txt}=this.state;
        txt.push(text);
        this.setState({
            txt:txt
        });
    }
    render(){
        var {txt}=this.state;
        return (
            <View style={styles.root}>
                <FlatList style={styles.root}
                    data={txt}
                    ItemSeparatorComponent={()=><View style={{height:1,backgroundColor: '#D3D3D3'}}/>}
                    renderItem={({item})=><Text style={{color:'black',}}>{item}</Text>}
                    keyExtractor={index=>index}
                />
            </View>
        );
    }
}

const styles=StyleSheet.create({
        root:{
            flex:1
        }
    }
)
