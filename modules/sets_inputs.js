// import React, { Component } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, TextInput  } from 'react-native';
import React, { useState, useEffect, Component } from 'react';




// const testSetting = {current_lang:'kor',kor:{min:0,max:10},eng:{min:0,max:10},hide:0}

class SetsInterf extends Component {

  constructor(props){
    super(props);
    this.state = {     
      scope: this.props.scope
    };
    this.testEventFromCh = this.testEventFromCh.bind(this);
    this.testEventFromInp = this.testEventFromInp.bind(this);
  } 

  componentDidMount() {
    // this.props.aguard.emit('attch', 'attch')
  }
  testEventFromCh(e){
    // console.log(e)
    this.setState({ scope: JSON.parse(e) }) 
    this.props.onIntChoTap(e)
  }

  testEventFromInp(e){
    // storeData('settings', e)
    // console.log(e)
    this.setState({ scope: JSON.parse(e) }) 
    this.props.onIntInpTap(e)
  }

  render(){
    const intInEmiter = this.props.intEmiter
    const scopeInSets = this.state.scope
    console.log(scopeInSets)
    return (  
      <View  style={styleSets.cont}>
        <View  style={styleSets.block1}>          
          <ChoiseInput aguard={intInEmiter} name='lang' label='Язык: ' 
          arr={['Inglash', 'Korean']}
          onTapChoise={this.testEventFromCh}
          scopeSets={scopeInSets} />
          <ChoiseInput aguard={intInEmiter} name='hide' label='Скрывать: ' 
          arr={['Inglash', 'Russil', 'Oba biba boba']} 
          onTapChoise={this.testEventFromCh}
          scopeSets={scopeInSets}  />
          <SetsInput aguard={intInEmiter} label='Min' numb='234' name='min' 
          onInpValueText={this.testEventFromInp}
          scp={scopeInSets} />
          <SetsInput aguard={intInEmiter} label='Max' numb='345' name='max' 
          onInpValueText={this.testEventFromInp}
          scp={scopeInSets} />
           
        </View>         
        <View  style={styleSets.block2}>          
            {/*<Text style={stylesElem.text}>{this.state.comments}</Text>*/}          
        </View>      
      </View >
    );    
  }
}



const SetsInput = (props) => {
  // const [number, onChangeNumber] = React.useState(props.scp[props.scp.current_lang][props.name] /*props.numb*/);
  const number = props.scp[props.scp.current_lang][props.name]

  // useEffect(() => {
  //       // Anything in here is fired on component mount.
  //       props.aguard.on('updMinMax', (lang) => {
  //         onChangeNumber(props.scp[lang][props.name])    
  //       })
  //       return () => {
  //           // Anything in here is fired on component unmount.
  //           props.aguard.removeAllListeners('updMinMax');
  //       }
  //   }, [])

  function onInInInInIn(e){
    props.onInpValueText(e);
  }

  function doroy(event) {
    event = parseInt(event)
    if(isNaN(event))  event = 0
    if(event > 10000 /*maxnumber*/) return
    // onChangeNumber(event)
    const bufScope = props.scp//scopeSets()
    bufScope[bufScope.current_lang][props.name] = event
    // storeData('settings', JSON.stringify(bufScope))
    onInInInInIn(JSON.stringify(bufScope))
  }

  return (
    <SafeAreaView>  
      <Text>{props.label}  </Text> 
      <TextInput        
          style={styleSets.input}
          onChangeText={doroy}
          value={number.toString()}
          keyboardType="numeric"
        />
      
    </SafeAreaView>
  );
};


const ChoiseInput = (props) => {
  let indArr = 0
  const scopeChoiseInput = props.scopeSets
  if(props.name == 'lang'){
      indArr = (scopeChoiseInput.current_lang == 'kor') ? 1 : 0      
    }
  else
    indArr = scopeChoiseInput.hide
  // console.log(props.name, indArr)
  // const [num, onChangeTap] = React.useState(indArr);  
  const num = indArr
  // const [variant, onChangeVar] = React.useState(props.arr[indArr]);
  const variant = props.arr[indArr]
  const varList = props.arr

   // useEffect(() => {
   //      return () => {
   //      }
   //  }, [])

  function onTapTapTapTap(e){
    props.onTapChoise(e);
  }

  function varvar(event) {
    
    const newnum = (num < (varList.length - 1)) ? num + 1 : 0

    if (props.name == 'lang'){
      scopeChoiseInput.current_lang = (newnum == 1) ? 'kor' : 'eng'
      // props.aguard.emit('updMinMax', scopeChoiseInput.current_lang)
    }
    else {
      scopeChoiseInput.hide = newnum
    }
    
    onTapTapTapTap(JSON.stringify(scopeChoiseInput))

    // onChangeTap(newnum)    
    // onChangeVar(varList[newnum])
    // onChangeScopeChoiseInput(scopeChoiseInput)
  }
  
  return (    
    <View> 
      <Pressable /*style={styleSets.pr}*/ 
        onPress={varvar}> 
        <View style={styleSets.choisebuttn}> 
          <Text style={styleSets.choisetext}>{props.label}{variant}</Text>
        </View>
      </Pressable>      
    </View>    
  )  
};




const styleSets = StyleSheet.create({
  cont: {
    width:'100%',
    height:'90%',
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  block1: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d7e4ebb',
    width:'100%',
    height:'73%',
  },
  block2: {
    backgroundColor: '#6c1515bb',
    width:'100%',
    height:'27%',
  },
  input: {
    color: '#fff',
    height: 40,
    width: 120,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontWeight: 'bold',
  },
  sets_cont: {
    width:'100%',
    height:'10%',
    flexDirection: "row",
    // flex: 1,
    // backgroundColor: '#5e4a20bb',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  choisebuttn: { 
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    selectable:false,
    // width:'100px',
    justifyContent: 'center',
    alignItems: 'center',
    height:40,    
    width:200,
    backgroundColor: '#777',
    marginTop:10,
  },
  choisetext:{
    color: '#fff',
    // fontSize: 13,
    fontWeight: 'bold',
  },
});

export default SetsInterf; // Don’t forget to use export default!