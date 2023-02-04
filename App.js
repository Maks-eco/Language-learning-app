import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TextInput, SafeAreaView, Dimensions, Image } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import Button from './modules/mainScreenBlock';
import SetsInterf from './modules/settingsInputs';


// let intEmiter = require('./modules/lessonGenerator').interfaceEmitter; //only mainblock 'event tap' & 'event change value'
// let scopeSets = require('./modules/lessonGenerator').scope; // => only get settings value localStore 
import {interfaceEmitter, scopeSetts} from './modules/lessonGenerator'
let intEmiter = interfaceEmitter
let scopeSets = scopeSetts

import { sendScopeSettings } from './modules/updateStateController'; // <= only set settings value localStore 


const heightX = Dimensions.get('screen').height;


function getDataPlug(key){
  
  return JSON.stringify(data[key])
}

class App extends Component {
  constructor (props){
    super(props)
    this.state = {     
      page: /*'sets'*/ 'main' //'empt inpt'
    };
    this.setsInterfFromInp = this.setsInterfFromInp.bind(this);
    // this.setsInterfFromChoi = this.setsInterfFromChoi.bind(this);
    this.changePage = this.changePage.bind(this);
    // props.aguard.on(props.msg_in, (msg) => {
    //   this.setState({ comments: msg })     
    // })
  }
  componentDidMount() {
    // this.props.aguard.emit('attch', 'attch')
  }
  setsInterfFromInp(e){
    /*return*/ sendScopeSettings(e)

  }


  changePage(e){
    console.log((this.state.page ==='sets') ? 'main' : 'sets')
    this.setState({ page: (this.state.page ==='sets') ? 'main' : 'sets'}) 
  }


  render (){
    if(this.state.page == 'main'){
      return (
        <View style={styles.container}>
          <Button style={styles.la} aguard={intEmiter} msg_in="shtwords1lang" msg_out="resp1" />
          <Button style={styles.tr} aguard={intEmiter} msg_in="shtwords2tran" msg_out="resp2" />
          <Button style={styles.ne} aguard={intEmiter} msg_in="shtwords3next" msg_out="resp3" />
          <View style={[styles.sets_cont,styles.bottom.main]}>            
            <Setst  style={styles.link} changePage={this.changePage} />            
          </View>
          <StatusBar style="auto" />
          <UpdView aguard={intEmiter} />
        </View>
      )
    } else {
      return (
      <View style={styles.container}>
        <SetsInterf /*aguard={intEmiter} */
        scope={scopeSets()} 
        onIntInpTap={this.setsInterfFromInp}
        onIntChoTap={this.setsInterfFromInp} 
        intEmiter={intEmiter}
        />
          <View style={[styles.sets_cont,styles.bottom.sets]}>           
            <Setst  style={styles.link}  changePage={this.changePage} />            
          </View>
        <StatusBar style="auto" />
      </View>
    )
    }
  }
}

class UpdView extends Component {
  constructor (props){
    super(props)
  }
  componentDidMount() {
    this.props.aguard.emit('attch', 'attch')
  }
  componentWillUnmount() {
  //   this.props.aguard.off(this.props.msg_out, () => {return true})
    // this.props.aguard.removeAllListeners('attch');
  }
  render (){
    return (            
      <View>        
      </View>            
    )
  }
}

class Setst extends Component {
  constructor (props){
    super(props)
    this.handEvenPrs = this.handEvenPrs.bind(this);
    
    // this.hehe = height
  }

  handEvenPrs(e){
    this.props.changePage(e)
  }
  render (){
    return (
      //<View>     
      <Pressable 
      style={styles.prsbl}
      onPress={this.handEvenPrs}>    
        <View style={styles.link}>
        <Image source={require('./assets/sets_star.png')} style={{width: 40, height: 40, marginLeft: 10}} />
        <Text>{/*{heightX}*/}</Text>
        </View>  
      </Pressable>   
      //</View> 
    )
  }
}

const newHe = (heightX - 100)
console.log(heightX)

const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:'100%',
    // flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },  
  sets_cont: {
    width:70,
    height:70,
    flexDirection: "row", 
    position: 'absolute', 
    marginTop: 50/*newHe*/,
    // bottom:'0',
    // zIndex: '50', 
  },
  la: {
    height:'33.33%',
    backgroundColor: '#0d7e4ebb'
  },
  tr: {
    height:'33.33%',
    backgroundColor: '#6c1515bb'
  },
  ne: {
    height:'33.33%',
    backgroundColor: '#5e4a20bb'
  },
  bottom: {
    main:{
      // backgroundColor: '#5e4a2000'
    },
    sets: {
      // backgroundColor: '#6c1515bb'
    }    
  },
  link: {
    width:"100%",
    height:"100%",
    // backgroundColor: '#777',
  },
  prsbl: {
    width:'100%',
    height:'100%',
  },
});

export default App;