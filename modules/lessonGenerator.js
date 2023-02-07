const EventEmitter = require('events');
const interfaceEmitter = new EventEmitter();
// const localStorEmitter = new EventEmitter();
//------------------------------------------------------------------------------------------------------------------script
import { sendScope, dataGlobDictionary, dataGlobSettings } from './updateStateController';

// let isScopeSet = true
let objIndProbGlobal = []
let onceCall = true

function updateScope () {  
  sendScope().then(()=>{
    // console.log('scopeUpdated')  
    const dictLen = dataGlobDictionary.length - 1
    const trainMax = dataGlobSettings[dataGlobSettings.current_lang].max
    objIndProbGlobal = generProbabilityPlotObj(trainMax > dictLen ? dictLen : trainMax)
    
    loadNewLesson() 
    // if(isScopeSet){
    //   loadNewLesson() 
    //   isScopeSet = false      
    // }
  })
}

interfaceEmitter
.on('resp1', (msg) => {
  try {  
    addTapUnhide()
  } catch(e) {    
    console.log(e)
  }
}).on('resp2', (msg) => {
  try {
    addTapUnhide()  
  } catch(e) {
    console.log(e)
  }
}).on('resp3', (msg) => { 
  try {  
    loadNewLesson()    
  } catch(e) {
    console.log(e)
  }
}).on('attch', (msg) => {
  try {
    console.log('attch: ' + msg);   
    loadNewLesson()
    updateScope()
  } catch(e) {
    console.log(e)
  }
})

function genRandomChunksField(lang_word, currentLang){
  let tpsArr = []
  const max = (currentLang == 'kor') ? lang_word.length : Math.ceil(lang_word.length / 3)
  // const max = Math.ceil(lang_word.length / 3)
  for (var i = 0; i < max; i++) {
    tpsArr.push(Math.random())/* = Math.random()*/
  }
  return toSequenceShowingPartsOfWords(tpsArr)
}

function toSequenceShowingPartsOfWords(tpsArr){
  let max = 0
  let tapesInd = []
  // console.log(tpsArr)
  for (var i = 0; i < tpsArr.length; i++) {
    max = Math.max(...tpsArr)
    tapesInd[i] = tpsArr.indexOf(max);
    tpsArr[tapesInd[i]] = 0
  }
  // console.log(tpsArr, tapesInd)
  return tapesInd
}


function symbolChange (symbol,  numberTapsEnt, init_word){
    //hide characters if no one touch, shift showing at one touch 
  if (numberTapsEnt == 0) return ' '

  let colTaps = numberTapsEnt - 1

  if(colTaps >= init_word.length /*+ 1*/) colTaps = init_word.length /*+ 1 */// //add shift +1 for hide '-' characters 
  let crop_word = ''  
  for (var i = 0; i < init_word.length; i++) {
    if(init_word[i] == ' ')
      crop_word += ' '
    else      
      crop_word += symbol       
  }
  return {colTaps, crop_word}
}
function showCharactersByTaps(numberTapsEnt, tpsArray, init_word, currentLang){ //-----Korean-----
  let {colTaps, crop_word} = symbolChange (currentLang == 'kor' ? 'ㅡ' : '-',  numberTapsEnt, init_word)
  for (var i = 0; i < colTaps; i++) {  
    if(currentLang == 'kor')  {
      crop_word = crop_word.substring(0,tpsArray[i]) 
        + init_word.substring(tpsArray[i],tpsArray[i]+1) 
        + crop_word.substring(tpsArray[i]+1) 
    } else {
      crop_word = crop_word.substring(0,tpsArray[i]*3) 
        + init_word.substring(tpsArray[i]*3,tpsArray[i]*3+3) 
        + crop_word.substring(tpsArray[i]*3+3) 
    }
  }
  return crop_word
}

function addInitTapUnhide(){
  let iniGlobOpendWord = ''
  let wordsArrayGlob = [] 
  let numbGlobTaps = 0 //tps
  let genGlob = [] // tps
  let iniGlobHiddenWord = '' //tps
  let wrdSemihiddenGlob = '' //tps
  let commnt = '' //tps
  let isHideTransl = true //hideTranslChoise(dataGlobSettings.hide)
  return (id) => {
    
    wordsArrayGlob = dataGlobDictionary
    if(id){
      isHideTransl = hideTranslChoise(dataGlobSettings.hide)
      numbGlobTaps = 0   
      // try{     
      iniGlobHiddenWord = (isHideTransl) ? wordsArrayGlob[id].la : wordsArrayGlob[id].tr
      iniGlobOpendWord = (!isHideTransl) ? wordsArrayGlob[id].la : wordsArrayGlob[id].tr
      commnt = wordsArrayGlob[id].co
// }catch(e){
//   console.log(objIndProbGlobal)
//   console.log(id)
//   console.log(e)
// }
      if (dataGlobSettings.current_lang == "kor"){
        genGlob = genRandomChunksField( iniGlobHiddenWord, (isHideTransl) ? 'kor' : 'eng')
      } else {
        genGlob = genRandomChunksField( iniGlobHiddenWord, 'eng')
      }
    }else{
      numbGlobTaps++
    }

    if (dataGlobSettings.current_lang == "kor"){        
      wrdSemihiddenGlob = showCharactersByTaps(numbGlobTaps, genGlob, iniGlobHiddenWord, (isHideTransl) ? 'kor' : 'eng')
    } else {    
      wrdSemihiddenGlob = showCharactersByTaps(numbGlobTaps, genGlob, iniGlobHiddenWord, 'eng')
    }
    if(isHideTransl){
      interfaceEmitter.emit('shtwords1lang', wrdSemihiddenGlob)
      interfaceEmitter.emit('shtwords2tran', iniGlobOpendWord)
    } else {
      interfaceEmitter.emit('shtwords2tran', wrdSemihiddenGlob)
      interfaceEmitter.emit('shtwords1lang', iniGlobOpendWord )
    }
    
    if(!id){
      if(numbGlobTaps >= wrdSemihiddenGlob.length + 1){ //add shift +1 for hide '-' characters 
        if (dataGlobSettings.current_lang == "kor")
          //!!!!!!!!!!!!!!! document.getElementById("comm").innerHTML = "(" + commnt + ")"
        console.log("commnt")
      }
    }
  }
}
const addTapUnhide = addInitTapUnhide()



function hideTranslChoise(hideParam){
  // console.log(hideParam)
  if(hideParam == 1){
    return false
  }
  if(hideParam == 2){
    return (Math.random() > 0.5) ? false : true
  }
  return true
}

// function settingInitAndSwitchAtCurrentLang(){ 

//   let setsCurLang = dataGlobSettings.current_lang
//   // console.log( setsCurLang)
//   if(setsCurLang == 'eng'){
//     return dataGlobSettings.eng    
//   }
//   // 'kor' or default:
//   return dataGlobSettings.kor 
// }

function loadNewLesson(){
  let max_train = 0
  // let min_train = 0
  // hideTranslChoise(dataGlobSettings.hide)
  // let sets = settingInitAndSwitchAtCurrentLang()

  max_train = dataGlobSettings[dataGlobSettings.current_lang].max // sets.max
  // min_train = sets.min
  // console.log( max_train)
  if(max_train > (dataGlobDictionary.length - 1)) {
    max_train = dataGlobDictionary.length - 1
  }
  addTapUnhide(randomChoiseFromPlotObj(max_train) /*teachRandom(min_train,max_train)*/)
}


function generateArrProbability(ind, len){
  let x = (ind - 7) / 100 
  let y = 9 * ( Math.pow(2.71,(-1*x + 0.7)) ) * Math.cos((4*x + 5)) * Math.cos((4*x + 1.35))  // 7 good piks on interval (-0.5; 5)
  return y
}


function generProbabilityPlotObj(len){
  const objBufIndProb = []
  let arrXpoints2 = new Array(len).fill(0)
  //let arrXpoints2 = [...arrXpoints]
  arrXpoints2 = arrXpoints2.slice(0, 500)
  for (var i = 0; i < arrXpoints2.length; i++) {
    arrXpoints2[i] = generateArrProbability(i, arrXpoints2.length)
    if (arrXpoints2[i] < 0) arrXpoints2[i] = 0
      else objBufIndProb.push({ind: i, prob: arrXpoints2[i]})
  }
// const objBufIndProb2 = objBufIndProb.slice(0, 500)
  return  objBufIndProb
}



function randomChoiseFromPlotObj(len){
  // console.log(len)
  if(onceCall){
    // console.log(len)
    objIndProbGlobal = generProbabilityPlotObj(len)
    onceCall = false
    console.log('onceCall = true')
  }
// console.log(objIndProbGlobal.length)
  
  let prblty = Math.random()
  //if(prblty < getMinY(objIndProbGlobal)) prblty += 0.01
  let someInd = Math.ceil( Math.random() * objIndProbGlobal.length ) - 1
  let goThis = true
  while(goThis){
    if (objIndProbGlobal[someInd].prob < prblty /*&& objIndProbGlobal[someInd].prob > prblty / 0.8*/){
      someInd = Math.ceil( Math.random() * objIndProbGlobal.length ) - 1 
      //prblty -= 0.01
      prblty = Math.random()
    }else{
      goThis = false
      goThis = chechIndexByAlreadyExist(someInd)
      if(goThis) someInd = Math.ceil( Math.random() * objIndProbGlobal.length ) - 1 
    }
  }
  return len - objIndProbGlobal[someInd].ind - 1
}

function chechIndexBy(){
  let exArr = []
  return (ind_arr) => {
    // console.log(exArr)
    if(exArr.includes(ind_arr)){
      return true
    } else {
      exArr.push(ind_arr)
      if (exArr.length > 6) exArr.shift()  
      return false   
    }
  }
}
const chechIndexByAlreadyExist = chechIndexBy()

const scopeSetts = () => {return dataGlobSettings}

export {/*localStorEmitter, */interfaceEmitter, scopeSetts}