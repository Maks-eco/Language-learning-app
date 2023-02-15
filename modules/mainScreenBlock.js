import {
  StyleSheet, Text, View, Pressable,
} from 'react-native'
import React, { Component } from 'react'

const stylesElem = StyleSheet.create({
  container: {
    width: '100%',
  },
  pressableZone: {
    width: '100%',
    height: '100%',
  },
  inner: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    selectable: false,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 30,
  },
  commentText: {
    color: '#ffffff77',
    fontSize: 15,
  },
})

class Button extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mainLabel: '다음', // 'empty input'
      commentLabel: ' ',
    }

    props.emitter
      .on(props.msgIn, (msg) => {
        this.setState({ mainLabel: msg, commentLabel: ' ' })
      })
      .on(`${props.msgIn}com`, (msg) => {
        this.setState({ commentLabel: msg })
      })
  }

  componentWillUnmount() {
    this.props.emitter.removeAllListeners(this.props.msgIn)
    this.props.emitter.removeAllListeners(`${this.props.msgIn}com`)
  }

  render() {
    return (
      <View style={[this.props.style, stylesElem.container]}>
      <Pressable style={stylesElem.pressableZone}
        onPress={() => {
          this.props.emitter.emit(this.props.msgOut)
        }}>
        <View style={stylesElem.inner}>
          <Text style={stylesElem.mainText}>{this.state.mainLabel}</Text>
          <Text style={stylesElem.commentText}>{this.state.commentLabel}</Text>
        </View>
      </Pressable>
      </View >
    )
  }
}

export default Button
