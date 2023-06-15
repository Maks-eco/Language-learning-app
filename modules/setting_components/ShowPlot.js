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
})

const ShowPlot = (props) => {
  const [varData, onChangeData] = React.useState([])
  const maxLen = props?.settingsData?.[props.settingsData.currentLang]?.max

  if ((varData.length === 0 || varData[0][0].ind !== maxLen) && maxLen !== 0) {
    props.intEmitter.emit(props.msgOut, maxLen)
    props.intEmitter.on(props.msgIn, (obj) => {
      onChangeData(obj)
    })
  }

  useEffect(() => {
    props.intEmitter.emit(props.msgOut, maxLen)
    props.intEmitter.on(props.msgIn, (obj) => {
      onChangeData(obj)
    })
    return () => {
      props.intEmitter.removeAllListeners(props.msgIn)
    }
  })

  let listItems
  if (varData) {
    listItems = varData.map((arr, grp) => (
      <View key={grp} style={{ marginHorizontal: -5, flexDirection: 'row' }}>
        <Text style={[styleSets.textMini, { left: 13 }]}>{arr[0].ind}</Text>
        {arr.map((item, key) => {
          const heightElem = Math.ceil(20 * item.prob)
          const margTop = 31 - heightElem
          return (
            <View
              key={key}
              style={[{ height: heightElem, marginTop: margTop }, styleSets.plotColumn]}
            ></View>
          )
        })}
        {arr.length > 8 && (
          <Text style={[styleSets.textMini, { left: -13 }]}>{arr[arr.length - 1].ind}</Text>
        )}
      </View>
    ))
  } else listItems = null

  return <View style={{ flexDirection: 'row' }}>{listItems}</View>
}

export default ShowPlot
