import { StatusBar } from 'expo-status-bar';
// import { registerRootComponent } from 'expo';
import { StyleSheet, Text, View, Pressable, TextInput, SafeAreaView } from 'react-native';
// import { createRoot } from 'react-dom/client';
import React, { useState, useEffect, Component } from 'react';
// import React, { Component } from "react";
import Button from './component';
import SetsInterf from './sets_inputs';

import AsyncStorage from '@react-native-async-storage/async-storage';

let intEmiter = require('./lessonGenerator').interfaceEmitter;
let lsEmiter = require('./lessonGenerator').localStorEmitter;
let scopeSets = require('./lessonGenerator').scope;

let emiter = require('./gsheetData').myEmitter;


emiter.on('gsheet words', (msg) => {
  // console.log('node is answers: ' + msg);  
  storeData('dictionary', msg)
  // localStorage.setItem('dictionary', msg);  
});

const data = {
  dictionary: [
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
  ],
  settings: {current_lang:'kor',kor:{min:0,max:10},eng:{min:0,max:10},hide:0},
}

function getDataPlug(key){
  
  return JSON.stringify(data[key])
}

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.log(e)
  }
}

const getData = async (key) => {
  try {
    // const value = getDataPlug(key)
    const value = await AsyncStorage.getItem(key /*'@storage_Key'*/)
    if(value !== null) {
      // console.log(value)
      return value
    }
  } catch(e) {
    console.log(e)    
  }
}


async function init(){
  getData('settings')
  .then((data) =>{ 
    data = JSON.parse(data)
    console.log(data.current_lang)
    emiter.emit('gsheetwordsupd', data.current_lang)
  }).catch(e => {
    console.log(e)
  })
}

init()

lsEmiter.on('updScope', async () => {
  sendScope()

}).on('getData', (msg) => {
   
})

async function sendScope(){
  Promise.all([
    //ert(),
    getData('dictionary'), 
    getData('settings')
  ]).then(results => {
     // console.log(results);
     lsEmiter.emit('scopeUpdated', results[0],results[1])
     // console.log("scopeUtytytytytys")
  }).catch(e => {
    console.log(e)
    storeData('dictionary', JSON.stringify(data.dictionary /*[{la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}]*/))
    storeData('settings', JSON.stringify({current_lang:'kor',kor:{min:0,max:10},eng:{min:0,max:10},hide:0}))
    
    setTimeout(()=>{
      // intEmiter.emit('attch', 'attch')
      // console.log("tytytytytys")
      sendScope()
    }, 1000)
    // sendScope()
    // intEmiter.emit('attch', 'attch')
  })
}
// sendScope()

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
    storeData('settings', e)
    sendScope().then(()=>{
      console.log('Bun in oven 2')
      return init()
    }).then(()=>{
      sendScope()
    }).then(()=>{
      console.log('Zapecheno 2')
    })
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
        <Text>{/*настройки*/}</Text>
        </View>  
      </Pressable>   
      //</View> 
    )
  }
}

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
    width:'100%',
    height:'10%',
    flexDirection: "row",    
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
    height:'23.33%',
    backgroundColor: '#5e4a20bb'
  },
  bottom: {
    main:{
      backgroundColor: '#5e4a20bb'
    },
    sets: {
      backgroundColor: '#6c1515bb'
    }    
  },
  link: {
    width:"100%",
    height:"100%",
    backgroundColor: '#777',
  },
  prsbl: {
    width:'20%',
    height:'100%',
  },
});

export default App;