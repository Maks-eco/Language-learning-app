import {
  StyleSheet, Text, View, Pressable, SafeAreaView, TextInput,
} from 'react-native'
import React, { useState, Component, useEffect } from 'react'

const styleSets = StyleSheet.create({
  plotColumn: {
    width: 2,
    margin: 1,
    backgroundColor: '#fff',
  },
  textMini: {
    color: '#ffffff99',
    fontWeight: 'bold',
    fontSize: 10,
    alignSelf: 'center',
    position: 'relative',
    top: 20,
  },
  contBlocks: {
    width: '100%',
    height: '100%',
  },
  blockTop: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d7e4ebb',
    width: '100%',
    height: '65%',
  },
  blockBottom: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6c1515bb',
    width: '100%',
    height: '35%',
  },
  legendTopBlock: {
    fontWeight: 'bold',
    color: '#ffffff99',
  },
  inputTopBlock: {
    color: '#fff',
    height: 40,
    width: 120,
    margin: 12,
    borderColor: '#ffffff99',
    borderWidth: 1,
    padding: 10,
    fontWeight: 'bold',
    marginTop: 0,
  },
  legendGsheet: {
    fontWeight: 'bold',
    color: '#ffffff77',
    fontSize: 10,
  },
  inputGsheet: {
    color: '#fff',
    height: 30,
    width: 200,
    margin: 6,
    borderColor: '#ffffff77',
    borderWidth: 1,
    // padding: 10,
    padding: 2,
    fontWeight: 'bold',
    marginTop: 0,
  },
  choiceButtn: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    selectable: false,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 200,
    backgroundColor: '#945454',
    marginBottom: 10,
  },
  choiceText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

class SetsInterf extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scope: this.props.scope,
    }
    this.testEventFromCh = this.testEventFromCh.bind(this)
  }

  componentDidMount() {
  }

  testEventFromCh(e) {
    this.setState({ scope: JSON.parse(e) })
    this.props.onIntChoTap(e)
  }

  render() {
    const intInEmitter = this.props.intEmitter
    const scopeInSets = this.state.scope

    return (
      <View style={styleSets.contBlocks}>
        <View style={styleSets.blockTop}>
          <ChoiceInput
            name='currentLang' label='Script: '
            arr={{ eng: 'latin', kor: 'hieroglyph' }}
            onTapChoice={this.testEventFromCh}
            settingsData={scopeInSets} />
          <ChoiceInput
            name='hide' label='Hide: '
            arr={{ eng: 'original', rus: 'translation', bth: 'alternately' }}
            onTapChoice={this.testEventFromCh}
            settingsData={scopeInSets} />
          <SetsInput
            name='max' label='Max'
            onInpValueText={this.testEventFromCh}
            settingsData={scopeInSets}
            scriptDependent
            maxnumber={10000} />
          <ShowPlot
            intEmitter={intInEmitter}
            msgIn='getPlotReturn' msgOut='getPlot'
            settingsData={scopeInSets} />
        </View>
        <View style={styleSets.blockBottom}>
          <SetsInput
            name='table' label='Google Sheets link'
            onInpValueText={this.testEventFromCh}
            settingsData={scopeInSets}
            textInputType />
          <SetsInput
            name='key' label='Google Sheets key'
            onInpValueText={this.testEventFromCh}
            settingsData={scopeInSets}
            textInputType />
          <SetsInput
            name='list' label='Page in table'
            onInpValueText={this.testEventFromCh}
            settingsData={scopeInSets}
            scriptDependent
            textInputType />
        </View>
      </View >
    )
  }
}

const ShowPlot = (props) => {
  const [varData, onChangeData] = React.useState([])
  const maxLen = props?.settingsData?.[props.settingsData.currentLang]?.max

  props.intEmitter.on(props.msgIn, (obj) => {
    onChangeData(obj)
  })

  if ((varData.length === 0 || varData[0][0].ind !== maxLen) && maxLen !== 0) {
    props.intEmitter.emit(props.msgOut, maxLen)
  }
  useEffect(() => {
    props.intEmitter.emit(props.msgOut, maxLen)
    return () => {
      props.intEmitter.removeAllListeners(props.msgIn)
    }
  })

  const listItems = varData.map((arr, grp) => (
    <View key={grp} style={{ marginHorizontal: -5, flexDirection: 'row' }}>
      <Text style={[styleSets.textMini, { left: 13 }]}>{arr[0].ind}</Text>
      {arr.map((item, key) => {
        const heightElem = Math.ceil(20 * item.prob)
        const margTop = 31 - heightElem
        return <View key={key} style={[{ height: heightElem, marginTop: margTop }, styleSets.plotColumn]}></View>
      })
      }
      {arr.length > 8
        && <Text style={[styleSets.textMini, { left: -13 }]}>{arr[arr.length - 1].ind}</Text>
      }
    </View>
  ))

  return (
    <View style={{ flexDirection: 'row' }}>
      {listItems}
    </View>
  )
}

const SetsInput = (props) => {
  let number
  if (props?.textInputType && !props?.scriptDependent) {
    number = props?.settingsData?.[props?.name]
    if (number && number !== '') number = number.toString()
  } else {
    number = props?.settingsData?.[props?.settingsData?.currentLang]?.[props?.name].toString()
  }

  function returnValueToParent(e) {
    props.onInpValueText(e)
  }

  function updateValueText(event) {
    let eventInt = event
    if (!props.textInputType) {
      eventInt = parseInt(event, 10)
      if (Number.isNaN(eventInt)) eventInt = 0
      if (eventInt > props.maxnumber) return
    }

    const bufSettings = props?.settingsData
    if (props?.scriptDependent) bufSettings[bufSettings.currentLang][props?.name] = eventInt
    else bufSettings[props?.name] = eventInt
    returnValueToParent(JSON.stringify(bufSettings))
  }

  const legendView = props?.textInputType ? styleSets.legendGsheet : styleSets.legendTopBlock
  const inputView = props?.textInputType ? styleSets.inputGsheet : styleSets.inputTopBlock
  const kboardtype = props?.textInputType ? 'text' : 'numeric'

  return (
    <SafeAreaView>
      <Text style={legendView}>{props.label}  </Text>
      <TextInput
          style={inputView}
          onChangeText={updateValueText}
          value={number}
          keyboardType={kboardtype}
        />

    </SafeAreaView>
  )
}

const ChoiceInput = (props) => {
  const [variant, onChangeTap] = React.useState(props.settingsData[props.name])
  const varList = Object.entries(props.arr)

  function nextKey(array, key) {
    let nextKeyInd
    for (let i = 0; i < array.length; i++) {
      if (i === array.length - 1) {
        nextKeyInd = 0
        break
      }
      if (array[i][0] === key) {
        nextKeyInd = i + 1
        break
      }
    }
    return array[nextKeyInd][0]
  }

  function returnValueToParent(e) {
    props.onTapChoice(e)
  }

  function updateChoice() {
    const bufSettings = props.settingsData
    const newKey = nextKey(varList, variant)
    bufSettings[props.name] = newKey
    returnValueToParent(JSON.stringify(bufSettings))
    onChangeTap(newKey)
  }

  return (
    <View>
      <Pressable onPress={updateChoice}>
        <View style={styleSets.choiceButtn}>
          <Text style={styleSets.choiceText}>{props.label}{props.arr[variant]}</Text>
        </View>
      </Pressable>
    </View>
  )
}

export default SetsInterf
