import { sendScope, dataGlobDictionary, dataGlobSettings } from './updateStateController'
import { randomChoiseFromPlotObj, updateProbabilityArray, preparePropabilityVisualisation } from './probabilityGenerator'

const EventEmitter = require('events')

const interfaceEmitter = new EventEmitter()

function toSequenceShowingPartsOfWords(tpsArr) {
  let max = 0
  const tapesInd = []
  for (let i = 0; i < tpsArr.length; i++) {
    max = Math.max(...tpsArr)
    tapesInd[i] = tpsArr.indexOf(max)
    tpsArr[tapesInd[i]] = 0
  }
  return tapesInd
}

function genRandomChunksField(langWord, currentLang) {
  const tpsArr = []
  const max = (currentLang === 'kor') ? langWord.length : Math.ceil(langWord.length / 3)
  for (let i = 0; i < max; i++) {
    tpsArr.push(Math.random())
  }
  return toSequenceShowingPartsOfWords(tpsArr)
}

function symbolChange(symbol, numberTapsEnt, initWord) {
  // hide characters if no one touch, shift showing at one touch
  if (numberTapsEnt === 0) return ' '

  let colTaps = numberTapsEnt - 1

  if (colTaps >= initWord.length /* + 1 */) colTaps = initWord.length /* + 1 */// //add shift +1 for hide '-' characters
  let cropWord = ''
  for (let i = 0; i < initWord.length; i++) {
    if (initWord[i] === ' ') { cropWord += ' ' } else { cropWord += symbol }
  }
  return { colTaps, cropWord }
}

function showCharactersByTaps(numberTapsEnt, tpsArray, initWord, currentLang) { // -----Korean-----
  let { colTaps, cropWord } = symbolChange(currentLang === 'kor' ? 'ㅡ' : '-', numberTapsEnt, initWord)
  for (let i = 0; i < colTaps; i++) {
    if (currentLang === 'kor') {
      cropWord = cropWord.substring(0, tpsArray[i])
        + initWord.substring(tpsArray[i], tpsArray[i] + 1)
        + cropWord.substring(tpsArray[i] + 1)
    } else {
      cropWord = cropWord.substring(0, tpsArray[i] * 3)
        + initWord.substring(tpsArray[i] * 3, tpsArray[i] * 3 + 3)
        + cropWord.substring(tpsArray[i] * 3 + 3)
    }
  }
  return cropWord
}

function hideTranslChoise(hideParam) {
  if (hideParam === 'rus') {
    return false
  }
  if (hideParam === 'bth') {
    return !((Math.random() > 0.5))
  }
  return true
}

function addInitTapUnhide() {
  let iniGlobOpendWord = ''
  let wordsArrayGlob = []
  let numbGlobTaps = 0
  let genGlob = []
  let iniGlobHiddenWord = ''
  let wrdSemihiddenGlob = ''
  let commnt = ''
  let isHideTransl = true
  return (id) => {
    wordsArrayGlob = dataGlobDictionary
    if (id) {
      isHideTransl = hideTranslChoise(dataGlobSettings.hide)
      numbGlobTaps = 0

      iniGlobHiddenWord = (isHideTransl) ? wordsArrayGlob[id].la : wordsArrayGlob[id].tr
      iniGlobOpendWord = (!isHideTransl) ? wordsArrayGlob[id].la : wordsArrayGlob[id].tr
      commnt = wordsArrayGlob[id].co

      if (dataGlobSettings.currentLang === 'kor') {
        genGlob = genRandomChunksField(iniGlobHiddenWord, (isHideTransl) ? 'kor' : 'eng')
      } else {
        genGlob = genRandomChunksField(iniGlobHiddenWord, 'eng')
      }
    } else {
      numbGlobTaps += 1
    }

    if (dataGlobSettings.currentLang === 'kor') {
      wrdSemihiddenGlob = showCharactersByTaps(numbGlobTaps, genGlob, iniGlobHiddenWord, (isHideTransl) ? 'kor' : 'eng')
    } else {
      wrdSemihiddenGlob = showCharactersByTaps(numbGlobTaps, genGlob, iniGlobHiddenWord, 'eng')
    }
    if (isHideTransl) {
      interfaceEmitter.emit('shtwords1lang', wrdSemihiddenGlob)
      interfaceEmitter.emit('shtwords2tran', iniGlobOpendWord)
    } else {
      interfaceEmitter.emit('shtwords2tran', wrdSemihiddenGlob)
      interfaceEmitter.emit('shtwords1lang', iniGlobOpendWord)
    }

    if (!id) {
      let tapsWrd
      if (dataGlobSettings.currentLang === 'kor' && isHideTransl) { tapsWrd = wrdSemihiddenGlob.length + 1 } else { tapsWrd = Math.ceil((wrdSemihiddenGlob.length / 3 + 1)) }
      if (numbGlobTaps > tapsWrd) {
        interfaceEmitter.emit('shtwords2trancom', commnt ? `(${commnt})` : ' ')
      }
    }
  }
}
const addTapUnhide = addInitTapUnhide()

function loadNewLesson() {
  let maxTrain = 0
  maxTrain = dataGlobSettings[dataGlobSettings.currentLang].max // sets.max

  if (maxTrain > (dataGlobDictionary.length - 1)) {
    maxTrain = dataGlobDictionary.length - 1
  }
  addTapUnhide(randomChoiseFromPlotObj(maxTrain))
}

function updateScope() {
  sendScope().then(() => {
    const dictLen = dataGlobDictionary.length - 1
    const trainMax = dataGlobSettings[dataGlobSettings.currentLang].max
    updateProbabilityArray(trainMax > dictLen ? dictLen : trainMax)

    loadNewLesson()
  })
}

interfaceEmitter
  .on('showWord', () => {
    try {
      addTapUnhide()
    } catch (e) {
      console.log(e)
    }
  })
  .on('nextWord', () => {
    try {
      loadNewLesson()
    } catch (e) {
      console.log(e)
    }
  })
  .on('attch', () => {
    try {
      // console.log('attch')
      updateScope()
    } catch (e) {
      console.log(e)
    }
  })
  .on('getPlot', (msg) => {
    try {
      interfaceEmitter.emit('getPlotReturn', preparePropabilityVisualisation(msg))
    } catch (e) {
      console.log(e)
    }
  })

const scopeSetts = () => dataGlobSettings

export { interfaceEmitter, scopeSetts }
