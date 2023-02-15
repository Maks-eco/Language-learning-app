import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet, View, Pressable, Image,
} from 'react-native'
import React, { Component } from 'react'
import Button from './modules/mainScreenBlock'
import SetsInterf from './modules/settingsInputs'
import { interfaceEmitter, scopeSetts } from './modules/lessonGenerator'
import { sendScopeSettings } from './modules/updateStateController'

const intEmitter = interfaceEmitter
const scopeSets = scopeSetts

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  setsCont: {
    width: 70,
    height: 70,
    flexDirection: 'row',
    position: 'relative',
    marginTop: -70,
  },
  original: {
    height: '33.33%',
    backgroundColor: '#0d7e4ebb',
  },
  translation: {
    height: '33.33%',
    backgroundColor: '#6c1515bb',
  },
  nextWord: {
    height: '33.33%',
    backgroundColor: '#5e4a20bb',
  },
  link: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  prsbl: {
    width: '100%',
    height: '100%',
  },
  img: {
    opacity: 0.35,
    width: 40,
    height: 40,
  },
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: /* 'sets' */ 'main', // 'empt inpt'
    }
    this.setsInterfFromInp = this.setsInterfFromInp.bind(this)
    this.changePage = this.changePage.bind(this)
  }

  setsInterfFromInp(e) {
    sendScopeSettings(e)
  }

  changePage() {
    this.setState({ page: (this.state.page === 'sets') ? 'main' : 'sets' })
  }

  render() {
    if (this.state.page === 'main') {
      return (
        <View style={styles.container}>
          <Button style={styles.original} emitter={intEmitter}
            msgIn="shtwords1lang" msgOut="showWord" />
          <Button style={styles.translation} emitter={intEmitter}
            msgIn="shtwords2tran" msgOut="showWord" />
          <Button style={styles.nextWord} emitter={intEmitter}
            msgIn="shtwords3next" msgOut="nextWord" />
          <View style={styles.setsCont}>
            <Setst style={styles.link} changePage={this.changePage} />
          </View>
          <StatusBar style="auto" />
          <UpdView emitter={intEmitter} />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <SetsInterf
        scope={scopeSets()}
        // onIntInpTap={this.setsInterfFromInp}
        onIntChoTap={this.setsInterfFromInp}
        intEmitter={intEmitter}
        />
        <View style={styles.setsCont}>
          <Setst style={styles.link} changePage={this.changePage} />
        </View>
        <StatusBar style="auto" />
      </View>
    )
  }
}

class UpdView extends Component {
  componentDidMount() {
    this.props.emitter.emit('attch')
  }

  render() {
    return (
      <View>
      </View>
    )
  }
}

class Setst extends Component {
  constructor(props) {
    super(props)
    this.handEvenPrs = this.handEvenPrs.bind(this)
  }

  handEvenPrs(e) {
    this.props.changePage(e)
  }

  render() {
    return (
      <Pressable
      style={styles.prsbl}
      onPress={this.handEvenPrs}>
        <View style={styles.link}>
          <Image source={require('./assets/sets_star_wt.png')} style={styles.img} />
        </View>
      </Pressable>
    )
  }
}

export default App
