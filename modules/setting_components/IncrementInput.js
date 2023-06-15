import {
  StyleSheet, Text, View, Pressable, SafeAreaView, TextInput,
} from 'react-native'
import React, { useState, Component, useEffect } from 'react'

// import ShowPlot from './ShowPlot'

const styleSets = StyleSheet.create({
  incrButtn: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    selectable: false,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    // backgroundColor: '#945454',
    // marginBottom: 10,
    borderRadius: 10,
    marginTop: 19,
    borderColor: '#ffffff77',
    borderWidth: 1,
  },
  incrText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    paddingBottom: 4,
  },
})

const SetsInput = (props) => {
  function returnValueToParent(e) {
    props.onInpValueText(e)
  }

  function updateValueText(event) {
    const bufSettings = props?.settingsData

    let incrnt = bufSettings[bufSettings.currentLang]?.increment ?? 10
    incrnt *= props?.positive ? 1 : -1
    if (bufSettings[bufSettings.currentLang][props?.name] + incrnt > 0) {
      bufSettings[bufSettings.currentLang][props?.name] += incrnt
    }
    returnValueToParent(JSON.stringify(bufSettings))
  }

  const legendView = props?.textInputType ? styleSets.legendGsheet : styleSets.legendTopBlock
  const inputView = props?.textInputType ? styleSets.inputGsheet : styleSets.inputTopBlock
  const kboardtype = props?.textInputType ? 'ascii-capable' : 'numeric'

  return (
    <View>
      <Pressable onPress={updateValueText}>
        <View style={styleSets.incrButtn}>
          <Text style={styleSets.incrText}>{props.label}</Text>
        </View>
      </Pressable>
    </View>
  )
}

export default SetsInput
