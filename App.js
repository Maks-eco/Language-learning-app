import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TextInput, SafeAreaView, Image } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import Button from './modules/mainScreenBlock';
import SetsInterf from './modules/settingsInputs';

import {interfaceEmitter, scopeSetts} from './modules/lessonGenerator'
let intEmiter = interfaceEmitter //only mainblock 'event tap' & 'event change value'
let scopeSets = scopeSetts // => only get settings value localStore 

import { sendScopeSettings } from './modules/updateStateController'; // <= only set settings value localStore 

class App extends Component {
  constructor (props){
    super(props)
    this.state = {     
      page: /*'sets'*/ 'main' //'empt inpt'
    };
    this.setsInterfFromInp = this.setsInterfFromInp.bind(this);
    this.changePage = this.changePage.bind(this);
  }
  componentDidMount() {
    // this.props.aguard.emit('attch', 'attch')
  }
  setsInterfFromInp(e){
    sendScopeSettings(e)
  }

  changePage(e){
    // console.log((this.state.page ==='sets') ? 'main' : 'sets')
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
        <Image source={require('./assets/sets_star_wt.png')} style={styles.img} />
        <Text>{/*{heightX}*/}</Text>
        </View>  
      </Pressable>   
      //</View> 
    )
  }
}


const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:'100%' ,
    // flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },  
  sets_cont: {
    width:70,
    height:70,
    flexDirection: "row", 
    position: 'relative', 
    marginTop: -70 /*50*/,
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

    alignItems: 'center',
    justifyContent: 'center', 
    width:"100%",
    height:"100%",
    // backgroundColor: '#777',
  },
  prsbl: {
    width:'100%',
    height:'100%',
  },
  img:{
    opacity: 0.35, 
    width: 40, 
    height: 40, 
    /*marginLeft: 10*/
},
});

export default App;