import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import DefaultConfig from "../DefaultConfig";

export default class OrderItem extends React.Component{

    static defaultProps={
        type:'',
        index:1,
        price:0.0,
        vol:0.0,
        maxWidth:180,
        maxNum:3000
    }
    state={
        maxWidth:this.props.maxWidth,
        maxNum:this.props.maxNum
    }

    render(){
        var {type,index,price,vol}=this.props;
        var {maxWidth,maxNum}=this.state;
        var width=vol/maxNum*maxWidth;
        switch (type){
            case 'buy':
                return (
                    <View>
                        <View style={[styles.back,{right:0,width:width,backgroundColor:'#C1FFC1'}]}/>
                        <View style={styles.root}>
                            <Text style={[styles.number,styles.index]}>{index}</Text>
                            <Text style={[styles.number,styles.buyVol]}>{vol==='量'?vol:(vol/1).toFixed(2)}</Text>
                            <Text style={[styles.number,styles.buyPrice]}>{price.substring(0,8)}</Text>
                        </View>
                    </View>
                )
            case 'sell':
                return (
                    <View>
                        <View style={[styles.back,{left:0,width:width,backgroundColor:'#f4cccc'}]}/>
                        <View style={styles.root}>
                            <Text style={[styles.number,styles.sellPrice]}>{price.substring(0,8)}</Text>
                            <Text style={[styles.number,styles.sellVol]}>{vol==='量'?vol:(vol/1).toFixed(2)}</Text>
                            <Text style={[styles.number,styles.index]}>{index}</Text>
                        </View>
                    </View>
                )
        }

    }
}

const styles=StyleSheet.create({
    back:{
        height:25,
        position:'absolute',
        top:0,
    },
    root:{
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        height:25,
        paddingLeft:5,
        paddingRight:5,
        backgroundColor:'transparent',
        position:'relative',
        top:0,
        left:0,
    },
    index:{
        color:'gray'
    },
    number:{
        fontSize:12,
        marginLeft:5,
        marginRight:5,
        height:25,
        lineHeight:25
    },
    buyPrice:{
        color:DefaultConfig.green,
        textAlign:'right'
    },
    sellPrice:{
        color:DefaultConfig.red,
        textAlign:'left',
    },
    buyVol:{
        flex:1,
        textAlign:'left',
        color:'gray'
    },
    sellVol:{
        flex:1,
        textAlign:'right',
        color:'gray'
    }
})