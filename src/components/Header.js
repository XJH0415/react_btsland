import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    Share,
    Modal,
    TouchableHighlight
} from 'react-native';
import MarketTab from '../components/MarketTab'
import AssetTab from "./AssetTab";
import DetailMarker from "../pages/DetailMarker";

export default class Header extends React.Component{
    static defaultProps={
        title:'',
        leftType:'',
        centerCanClick:false,
        rightType:'',
        navigation:null,
    }
    shareOnPress: Function;
    state={
        title:this.props.title,
        leftType:this.props.leftType,
        centerCanClick:this.props.centerCanClick,
        rightType:this.props.rightType,
        base:'CNY',
        quote:'BTS',
        bottomVisible:false,
    }
    hideBottom(){
        this.setState({bottomVisible:false})
    }
    marketOnPress=(base,quote)=>{
      if(this.props.navigation){
        this.props.navigation.navigate('DetailMarker',{base:base,quote:quote})
      }
    }
    searchOnPress=()=>{

    }
    shareOnPress=()=>{
        Share.share({
            message:'欢迎使用btsland全新版本，最新资讯，行情不容错过。',
            url: 'https://www.btsland.info',
            title: '分享'
        }, {
            dialogTitle: '分享',
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ],
            tintColor: 'green'
        })
            .then()
            .catch((error) => this.setState({result: 'error: ' + error.message}));
    }
    backOnPress=()=>{
        const { goBack } = this.props.navigation;
        goBack();
    }
    render(){
        this.shareOnPress=this.shareOnPress.bind(this);
        var {base,quote,title,leftType,centerCanClick,rightType}=this.state;
        var rightImage=require('../icon/search.png');
        var leftImage=require('../icon/share.png');
        var rightOnPress=null;
        var leftOnPress=null;
        switch(rightType){
            case 'search':
                rightImage=require('../icon/search.png');
                rightOnPress=()=>{
                    this.searchOnPress();
                }
                break;
            case 'market':
                rightImage=require('../icon/market.png');
                rightOnPress=()=>{
                    this.marketOnPress(base,quote);
                }
                break;
            case 'none':
                rightImage=null;
                rightOnPress=()=>{

                }
                break;
        }
        switch(leftType){
            case 'share':
                leftImage=require('../icon/share.png');
                leftOnPress=()=>{
                    this.shareOnPress();
                }
                break;
            case 'back':
                leftImage=require('../icon/back.png');
                leftOnPress=()=>{
                    this.backOnPress();
                }
                break;
        }
        return(
            <View style={styles.root} >
                <View style={styles.top} >
                    <View style={styles.leftView}>
                        <TouchableOpacity style={styles.share} onPress={leftOnPress}>
                            <Image style={styles.shareImage} source={leftImage}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleView}>
                        {
                            centerCanClick?(
                                <TouchableOpacity style={{flex:1}}  onPress={()=>{
                                    this.state.bottomVisible?this.setState({bottomVisible:false}):this.setState({bottomVisible:true})
                                }}>
                                    <Text style={styles.titleText}>{quote}/{base}▼</Text>
                                </TouchableOpacity>
                            ):(
                                <Text style={styles.titleText}>{title}</Text>
                            )
                        }
                    </View>
                    <View style={styles.rightView}>
                        <TouchableOpacity style={styles.search} onPress={rightOnPress}>
                            <Image style={styles.searchImage} source={rightImage}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.bottomVisible?<View style={[styles.bottom]}><AssetTab/></View>:null}
            </View>
        );
    }

};
const styles=StyleSheet.create({
    root:{
        paddingTop:20,
        height:60,
        backgroundColor:'#4682B4',
        overflow:'visible',
        zIndex:2,
    },
    top:{
        flexDirection:'row',
        justifyContent:'space-between',
        height:40,
        backgroundColor:'transparent',
    },
    bottom:{
        height:250,
        borderWidth:0.3,
        borderColor:'#D3D3D3',
        backgroundColor:'white'
    },
    leftView:{
        width:40
    },
    rightView:{

    },
    titleView:{

        flex:1
    },
    titleText:{
        flex:1,
        textAlign:'center',
        lineHeight:40,
        color:'white',
        fontSize:16,
        fontWeight:'bold'
    },
    share:{
        width:40,
    },
    shareImage:{
        margin:8,
        height:24,
        width:24,
    },
    search:{
        width:40,
    },
    searchImage:{
        margin:8,
        height:24,
        width:24,
    }
});


