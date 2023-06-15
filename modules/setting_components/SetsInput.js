import {
  StyleSheet, Text, View, Pressable, SafeAreaView, TextInput,
} from 'react-native'
import React, { useState, Component, useEffect } from 'react'

// import ShowPlot from './ShowPlot'

const styleSets = StyleSheet.create({
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
})

const SetsInput = (props) => {
  let number
  if (props?.textInputType && !props?.scriptDependent) {
    number = props?.settingsData?.[props?.name]
    if (number && number !== '') number = number.toString()
  } else {
    number = props?.settingsData?.[props?.settingsData?.currentLang]?.[props?.name]?.toString() ?? ''
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
  const kboardtype = props?.textInputType ? 'ascii-capable' : 'numeric'

  return (
    <SafeAreaView>
      <Text style={legendView}>{props.label} </Text>
      <TextInput
        style={inputView}
        onChangeText={updateValueText}
        value={number}
        keyboardType={kboardtype}
      />
    </SafeAreaView>
  )
}

export default SetsInput
