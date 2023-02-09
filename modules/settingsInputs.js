// import React, { Component } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, TextInput  } from 'react-native';
import React, { useState, Component, useEffect } from 'react';

class SetsInterf extends Component {

  constructor(props){
    super(props);
    this.state = {     
      scope: this.props.scope
    };
    this.testEventFromCh = this.testEventFromCh.bind(this);
    // this.testEventFromInp = this.testEventFromInp.bind(this);
  } 

  componentDidMount() {
  }

  testEventFromCh(e){
    this.setState({ scope: JSON.parse(e) }) 
    this.props.onIntChoTap(e)
  }

  // testEventFromInp(e){
  //   this.setState({ scope: JSON.parse(e) }) 
  //   this.props.onIntInpTap(e)
  // }

  render(){
    const intInEmiter = this.props.intEmiter
    const scopeInSets = this.state.scope
    // console.log(scopeInSets)
    return (  
      <View  style={styleSets.cont}>
        <View  style={styleSets.block1}>         
          <ChoiseInput 
            name='current_lang' label='Скрывать: ' 
            arr={{eng:'English', kor:'Korean'}} 
            onTapChoise={this.testEventFromCh}
            settingsData={scopeInSets}  />
          <ChoiseInput 
            name='hide' label='Скрывать: ' 
            arr={{eng:'оригинал', rus:'перевод', bth:'попеременно'}} 
            onTapChoise={this.testEventFromCh}
            settingsData={scopeInSets}  />
          {/*<SetsInput 
            name='min' label='Min'
            onInpValueText={this.testEventFromInp}
            settingsData={scopeInSets}  />*/}
          <SetsInput 
            name='max' label='Max' 
            onInpValueText={this.testEventFromCh}
            settingsData={scopeInSets} />     
          <ShowPlot 
            /*name='max' label='Max' 
            onInpValueText={this.testEventFromInp}
            settingsData={scopeInSets}*/
            intEmiter={intInEmiter}
            settingsData={scopeInSets} />       
        </View>         
        <View style={styleSets.block2}>                   
        </View>      
      </View >
    );    
  }
}

const ShowPlot = (props) => {
  const [varData, onChangeData] = React.useState([]);  
  const maxLen = props.settingsData[props.settingsData.current_lang].max

  props.intEmiter.on('getPlotReturn', (obj)=>{     
    onChangeData(obj)
  })  
  
  if((varData.length == 0 || varData[0][0].ind !== maxLen) && maxLen !== 0 ){
      props.intEmiter.emit('getPlot', maxLen)
  }
  useEffect(() => {
      props.intEmiter.emit('getPlot', maxLen)      
    return () => {
      props.intEmiter.removeAllListeners('getPlotReturn');
    };
  });

  const listIt = varData.map((arr, grp)=>{
    return (
      <View key={grp} style={{      marginHorizontal:-5, flexDirection: "row", }}>
        <Text style={[styleSets.textMini, { left: 13,}]}>{arr[0].ind}</Text>     
        {arr.map((item, key)=>{
          const heiEl = Math.ceil(20*item.prob)
          const marTop = 31 - heiEl  
            return <View key={key} style={[{height:heiEl,marginTop:marTop,  } , styleSets.plotColumn  ]}></View>
          })
        }
        {arr.length > 8 &&
          <Text style={[styleSets.textMini, { left: -13,}]}>{arr[arr.length-1].ind}</Text>         
        }
      </View>
    )
  })

// console.log(listIt)
  return (
    <View style={{flexDirection: "row"}}>
      {listIt}
    </View>
  );
};

const SetsInput = (props) => {
  const number = props.settingsData[props.settingsData.current_lang][props.name]

  function onInInInInIn(e){
    props.onInpValueText(e);
  }

  function doroy(event) {
    event = parseInt(event)
    if(isNaN(event))  event = 0
    if(event > 10000 /*maxnumber*/) return
    const bufScope = props.settingsData
    bufScope[bufScope.current_lang][props.name] = event
    onInInInInIn(JSON.stringify(bufScope))
  }

  return (
    <SafeAreaView>  
      <Text style={styleSets.inputLegend}>{props.label}  </Text> 
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
  const scopeChoiseInput = props.settingsData 
  let innerStorValue = scopeChoiseInput[props.name]     
  const [variant, onChangeTap] = React.useState(innerStorValue);  
  const varList = Object.entries(props.arr)

  function nextKey(array, key){
    let nextKeyInd 
    for (var i = 0; i < array.length; i++) {
      if(i == array.length - 1){
        nextKeyInd = 0
        break
      }
      if(array[i][0] == key){
        nextKeyInd = i + 1
        break
      }
    }
    return array[nextKeyInd][0]
  }

  function onTapTapTapTap(e){
    props.onTapChoise(e);
  }

  function varvar(event) {    
    const newnum = nextKey(varList, variant)
    scopeChoiseInput[props.name] = newnum
    onTapTapTapTap(JSON.stringify(scopeChoiseInput))
    onChangeTap(newnum)
  }
  
  return (    
    <View> 
      <Pressable onPress={varvar}> 
        <View style={styleSets.choisebuttn}> 
          <Text style={styleSets.choisetext}>{props.label}{props.arr[variant]}</Text>
        </View>
      </Pressable>      
    </View>    
  )  
};



const styleSets = StyleSheet.create({
  miniblock:{
    height: 40,
    width: 40,
    margin: 12,
    backgroundColor: '#444',
  },
  plotColumn:{
    width:2,
    // height:heiEl,
    margin: 1,
    backgroundColor: '#fff',
    // marginTop:marTop,  
  },
  textMini:{
    color: '#ffffff99',
    fontWeight: 'bold',
    fontSize: 10,
    alignSelf: 'center', 
    position:'relative',
    top: 20, 
  },
  cont: {
    width:'100%',
    height:'100%',
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
  inputLegend:{
    fontWeight: 'bold',
    color: '#945454' /*'#fff'*/,
  },
  input: {
    color: '#fff',
    height: 40,
    width: 120,
    margin: 12,
    borderColor: '#945454' /*'#fff'*/,
    borderWidth: 1,
    padding: 10,
    fontWeight: 'bold',
    marginTop:0,
  },
  sets_cont: {
    width:'100%',
    height:'10%',
    flexDirection: "row",
  },
  choisebuttn: { 
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    selectable:false,
    justifyContent: 'center',
    alignItems: 'center',
    height:40,    
    width:200,
    backgroundColor: '#945454',
    marginBottom:10,
  },
  choisetext:{
    color: '#fff',
    fontWeight: 'bold',
  },
  legend:{
    fontWeight: 'bold',
  }
});

export default SetsInterf; // Don’t forget to use export default!