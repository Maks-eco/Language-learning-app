// import React, { Component } from 'react';
import { StyleSheet, Text, View, Pressable  } from 'react-native';
import React, { useState, useEffect, Component } from 'react';



class Button extends Component {

  constructor(props){
    super(props);
    this.state = {     
      comments: '다음'//'empt inpt'
    };

    props.aguard.on(props.msg_in, (msg) => {
      this.setState({ comments: msg })     
    })
  } 

  componentDidMount() {
    // this.props.aguard.emit('attch', 'attch')
  }
  componentWillUnmount() {
  //   this.props.aguard.off(this.props.msg_out, () => {return true})
    // this.props.aguard.removeAllListeners(this.props.msg_out);
    this.props.aguard.removeAllListeners(this.props.msg_in);
  }

  //.removeListener('event', callbackB);

  render(){
    return (  
      <View  style={[this.props.style,stylesElem.container]/*stylesElem.container*/}>
      <Pressable style={stylesElem.pr}
          onPress={() => {
            this.props.aguard.emit(this.props.msg_out, this.props.msg_in + " pressed")
          }}>    
        <View  style={stylesElem.inner}>
          
            <Text style={stylesElem.text}>{this.state.comments}</Text>
          
        </View>
      </Pressable>
      </View >
    );    
  }
}



const stylesElem = StyleSheet.create({
  container: {
    // flex: 1,
    width:'100%',
    // height:'33.33%',
    //////////////////////////////////// height:'30%',
    // backgroundColor: '#fdf',    
    // alignItems: 'center',
    // justifyContent: 'center',

  },
  pr: {
    width:'100%',
    height:'100%',
  },
  inner:{
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    selectable:false,
    // flex: 0.3,
    width:'100%',
    height:'100%',
    // height: '30%',
    // height: '200px',
    alignItems: 'center',
    justifyContent: 'center',    
  },
  text:{
    color: '#fff',
    fontSize: 30,
  }
});
 


export default Button; // Don’t forget to use export default!