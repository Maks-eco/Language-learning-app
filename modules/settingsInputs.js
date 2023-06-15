import {
  StyleSheet, Text, View, Pressable, SafeAreaView, TextInput,
} from 'react-native'
import React, { useState, Component, useEffect } from 'react'

import SetsInput from './setting_components/SetsInput'
import ShowPlot from './setting_components/ShowPlot'
import ChoiceInput from './setting_components/ChoiceInput'
import IncrementInput from './setting_components/IncrementInput'

const styleSets = StyleSheet.create({
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
})

class SetsInterf extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scope: this.props.scope,
    }
    this.testEventFromCh = this.testEventFromCh.bind(this)
  }

  componentDidMount() {}

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
            name="currentLang"
            label="Script: "
            arr={{ eng: 'latin', kor: 'hieroglyph' }}
            onTapChoice={this.testEventFromCh}
            settingsData={scopeInSets}
          />
          <ChoiceInput
            name="hide"
            label="Hide: "
            arr={{ eng: 'original', rus: 'translation', bth: 'alternately' }}
            onTapChoice={this.testEventFromCh}
            settingsData={scopeInSets}
          />
          <SetsInput
            name="increment"
            label="Daily gain"
            onInpValueText={this.testEventFromCh}
            settingsData={scopeInSets}
            scriptDependent
            maxnumber={10000}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 260 }}>
            <IncrementInput
              name="max"
              label="-"
              onInpValueText={this.testEventFromCh}
              settingsData={scopeInSets}
              scriptDependent
              maxnumber={10000}
            />
            <SetsInput
              name="max"
              label="Max"
              onInpValueText={this.testEventFromCh}
              settingsData={scopeInSets}
              scriptDependent
              maxnumber={10000}
            />

            <IncrementInput
              name="max"
              label="+"
              onInpValueText={this.testEventFromCh}
              settingsData={scopeInSets}
              scriptDependent
              maxnumber={10000}
              positive
            />
          </View>
          <ShowPlot
            intEmitter={intInEmitter}
            msgIn="getPlotReturn"
            msgOut="getPlot"
            settingsData={scopeInSets}
          />
        </View>
        <View style={styleSets.blockBottom}>
          <SetsInput
            name="table"
            label="Google Sheets link"
            onInpValueText={this.testEventFromCh}
            settingsData={scopeInSets}
            textInputType
          />
          <SetsInput
            name="key"
            label="Google Sheets key"
            onInpValueText={this.testEventFromCh}
            settingsData={scopeInSets}
            textInputType
          />
          <SetsInput
            name="list"
            label="Page in table"
            onInpValueText={this.testEventFromCh}
            settingsData={scopeInSets}
            scriptDependent
            textInputType
          />
        </View>
      </View>
    )
  }
}

export default SetsInterf
