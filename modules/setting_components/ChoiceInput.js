import {
  StyleSheet, Text, View, Pressable, SafeAreaView, TextInput,
} from 'react-native'
import React, { useState, Component, useEffect } from 'react'

// import ShowPlot from './ShowPlot'

const styleSets = StyleSheet.create({
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
          <Text style={styleSets.choiceText}>
            {props.label}
            {props.arr[variant]}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

export default ChoiceInput
