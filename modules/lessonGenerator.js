const EventEmitter = require('events');
const interfaceEmitter = new EventEmitter();
// const localStorEmitter = new EventEmitter();
//------------------------------------------------------------------------------------------------------------------script
import { sendScope, dataGlobDictionary, dataGlobSettings } from './updateStateController';

let scope = {}
let isScopeSet = true
let isHideTransl = false

function updateScope () {
  // localStorEmitter.emit('updScope','uh')
  // sendScope().then((msg)=>{ 
  //   // console.log(msg.ms1, msg.ms2)
  //   scope.dict = JSON.parse(msg.dict)
  //   scope.sets = JSON.parse(msg.sets)
  //   // console.log('scopeUpdated')
  //   isScopeSet = true
  //   interfaceEmitter.emit('loadLessn')
  // })
  
  sendScope().then(()=>{// loadNewLesson()
    // scope.dict = dataGlobDictionary
    // scope.sets = dataGlobSettings
    // console.log('scopeUpdated')
    // isScopeSet = true
    // interfaceEmitter.emit('loadLessn')
    console.log('scopeUpdated')
    if(isScopeSet){
      interfaceEmitter.emit('resp3')
      isScopeSet = false
    }
  })
}
// updateScope ()


let wordsArrayGlob = [] /*[
  {la: "클릭", tr: "нажмите", co: "keullig"},
  {la: "클릭", tr: "нажмите", co: "keullig"},
  {la: "클릭", tr: "нажмите", co: "keullig"},
  {la: "클릭", tr: "нажмите", co: "keullig"},
  {la: "클릭", tr: "нажмите", co: "keullig"},
  {la: "클릭", tr: "нажмите", co: "keullig"},
  {la: "클릭", tr: "нажмите", co: "keullig"},
  {la: "클릭", tr: "нажмите", co: "keullig"},
  {la: "클릭", tr: "нажмите", co: "keullig"},
  {la: "클릭", tr: "нажмите", co: "keullig"},
  {la: "클릭", tr: "нажмите", co: "keullig"},
  {la: "클릭", tr: "нажмите", co: "keullig"},
]*/
let taps = []
let col_gl_taps = 0

interfaceEmitter.on('resp1', (msg) => {
  try {  
    /*isScopeSet &&*/ add_taps()
  } catch(e) {    
    console.log(e)
  }
}).on('resp2', (msg) => {
  try {
    /*isScopeSet &&*/ add_taps()  
  } catch(e) {
    console.log(e)
  }
}).on('resp3', (msg) => {
  try {  
    /*isScopeSet &&*/ loadNewLesson() //next_taps()
    // updateScope()
  } catch(e) {
    console.log(e)
  }
}).on('attch', (msg) => {
  try {
    onceCall = true 
    // if(isScopeSet){
      console.log('attch: ' + msg);   
      loadNewLesson()
      updateScope()
    // } else {
    //   updateScope()
    // }
  } catch(e) {
    console.log(e)
  }
})
// .on('loadLessn', (msg) => {
//   try {    
//     console.log('loadLessn');  
//     onceCall = true 
//     loadNewLesson()      
//   } catch(e) {
//     console.log(e)
//   }
// })



function genRandomChunksFieldKor( lang_word){//-----Korean-----
  let taps_arr = []
  for (var i = 0; i < lang_word.length; i++) {
    taps_arr.push(Math.random())/* = Math.random()*/
  }
  return toSequenceShowingPartsOfWords(taps_arr)
}
function genRandomChunksFieldEng( lang_word){//-----English-----
  let taps_arr = []
  for (var i = 0; i < Math.ceil(lang_word.length / 3); i++) {
    taps_arr.push(Math.random())/* = Math.random()*/
  }
  return toSequenceShowingPartsOfWords(taps_arr)
}
function toSequenceShowingPartsOfWords(taps_arr){
  let max = 0
  let taps_ind = []
  // console.log(taps_arr)
  for (var i = 0; i < taps_arr.length; i++) {
    max = Math.max(...taps_arr)
    taps_ind[i] = taps_arr.indexOf(max);
    taps_arr[taps_ind[i]] = 0
  }
  // console.log(taps_arr, taps_ind)
  return taps_ind
}


function symbolChange (symbol,  col_taps_ent, init_word){
    //hide characters if no one touch, shift showing at one touch 
  if (col_taps_ent == 0) return ' '

  let col_taps = col_taps_ent - 1

  if(col_taps >= init_word.length /*+ 1*/) col_taps = init_word.length /*+ 1 */// //add shift +1 for hide '-' characters 
  let crop_word = ''  
  for (var i = 0; i < init_word.length; i++) {
    if(init_word[i] == ' ')
      crop_word += ' '
    else      
      crop_word += symbol       
  }
  return {col_taps, crop_word}
}
function showCharactersByTapsKor(col_taps_ent, taps_array, init_word){ //-----Korean-----
  let {col_taps, crop_word} = symbolChange ('ㅡ',  col_taps_ent, init_word)
  for (var i = 0; i < col_taps; i++) {    
    crop_word = crop_word.substring(0,taps_array[i]) + init_word.substring(taps_array[i],taps_array[i]+1) + crop_word.substring(taps_array[i]+1) 
  }
  return crop_word
}
function showCharactersByTapsEng(col_taps_ent, taps_array, init_word){ //-----English-----
  let {col_taps, crop_word} = symbolChange ('-',  col_taps_ent, init_word)
  for (var i = 0; i < col_taps; i++) {    
    crop_word = crop_word.substring(0,taps_array[i]*3) + init_word.substring(taps_array[i]*3,taps_array[i]*3+3) + crop_word.substring(taps_array[i]*3+3) 
  }
  return crop_word
}


let genGlob = []
let iniGlobHiddenWord = ''
let wrdSemihiddenGlob = ''
let commnt = ''

let settings = {}

function showAllById(id = 0){
  taps = []
  col_gl_taps = 0
  if (isHideTransl) { 
    iniGlobHiddenWord = wordsArrayGlob[id].la
  } else {
    iniGlobHiddenWord = wordsArrayGlob[id].tr
  }    
  commnt = wordsArrayGlob[id].co
  console.log(iniGlobHiddenWord)
  if (settings.current_lang == "kor"){
    if(isHideTransl){
      genGlob = genRandomChunksFieldKor( iniGlobHiddenWord)}
    else{
      genGlob = genRandomChunksFieldEng( iniGlobHiddenWord)}
    wrdSemihiddenGlob = showCharactersByTapsKor(col_gl_taps, genGlob, iniGlobHiddenWord)
  } else {
    genGlob = genRandomChunksFieldEng( iniGlobHiddenWord)
    wrdSemihiddenGlob = showCharactersByTapsEng(col_gl_taps, genGlob, iniGlobHiddenWord)
  }
  if(isHideTransl){
    interfaceEmitter.emit('shtwords1lang', wrdSemihiddenGlob)
    interfaceEmitter.emit('shtwords2tran', wordsArrayGlob[id].tr)
  } else {
    interfaceEmitter.emit('shtwords2tran', wrdSemihiddenGlob)
    interfaceEmitter.emit('shtwords1lang', wordsArrayGlob[id].la)
  }    
}

function hideTranslChoise(hideParam){
  // scope.sets.hide
  if(hideParam == 1){
    isHideTransl = false
    return
  }
  if(hideParam == 2){
    isHideTransl = (Math.random() > 0.5) ? false : true
    return
  }
  // 0 or default:
  isHideTransl = true  
}

function settingInitAndSwitchAtCurrentLang(){ 
  let sets_ls = dataGlobSettings /*scope.sets*/
  if (typeof(sets_ls)==="undefined" || sets_ls===null){
    // settings.current_lang = 'kor'
    // settings = 
    console.log('settings empty')
  } else {
    settings = sets_ls
  }
  let setsCurLang = settings.current_lang
  // console.log( setsCurLang)
  if(setsCurLang == 'eng'){
    return settings.eng    
  }
  // 'kor' or default:
  return settings.kor 
}

function loadNewLesson(){
  let max_train = 0
  let min_train = 0
  hideTranslChoise(/*scope.sets*/dataGlobSettings.hide)
  let sets = settingInitAndSwitchAtCurrentLang()

  let wor_d = dataGlobDictionary /*scope.dict*/ //JSON.parse(localStorage.getItem('dictionary'));
// console.log(wor_d)
  if (typeof wor_d == "undefined" || wor_d.length === 0){
    // console.log('ny_ept')
  }else{
    wordsArrayGlob = wor_d
  }  
  
  // if (typeof sets === "undefined" || sets===null){
  //   showAllById(teachRandom(0,wordsArrayGlob.length - 1))
  // } else {
  max_train = sets.max
  min_train = sets.min
  if(max_train > (wordsArrayGlob.length - 1)) max_train = wordsArrayGlob.length - 1
  showAllById(teachRandom(min_train,max_train))
  // }
}

let exArr = []
let objIndProbGlobal = []
let onceCall = true

function generateArrProbability(ind, len){
  let x = (ind - 7) / 100 
  let y = 9 * ( Math.pow(2.71,(-1*x + 0.7)) ) * Math.cos((4*x + 5)) * Math.cos((4*x + 1.35))  // 7 good piks on interval (-0.5; 5)
  return y
}


function generProbabilityPlotObj(len){
  let arrXpoints2 = new Array(len).fill(0)
  //let arrXpoints2 = [...arrXpoints]
  arrXpoints2 = arrXpoints2.slice(0, 500)
  for (var i = 0; i < arrXpoints2.length; i++) {
    arrXpoints2[i] = generateArrProbability(i, arrXpoints2.length)
    if (arrXpoints2[i] < 0) arrXpoints2[i] = 0
      else objIndProbGlobal.push({ind: i, prob: arrXpoints2[i]})
  }
}



function randomChoiseFromPlotObj(len){
  if(onceCall){
    generProbabilityPlotObj(len)
    onceCall = false
    console.log('onceCall = true')
  }

  
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

function chechIndexByAlreadyExist(ind_arr){
  if(exArr.includes(ind_arr)){
    return true
  } else {
    exArr.push(ind_arr)
    if (exArr.length > 6) exArr.shift()  
    return false   
  }
}



function teachRandom(min, max){

  return randomChoiseFromPlotObj(max)//randomPlaceIndexByLowFreq(max)
}


function add_taps(){

  if (/*scope.sets*/dataGlobSettings.current_lang == "kor"){    
    col_gl_taps++
    if(isHideTransl){
      wrdSemihiddenGlob = showCharactersByTapsKor(col_gl_taps, genGlob, iniGlobHiddenWord)
    }else{
      wrdSemihiddenGlob = showCharactersByTapsEng(col_gl_taps, genGlob, iniGlobHiddenWord)
    }
  }
  else {
    //col_gl_taps+=3
    col_gl_taps++
    wrdSemihiddenGlob = showCharactersByTapsEng(col_gl_taps, genGlob, iniGlobHiddenWord)
  }

  if(isHideTransl){
    interfaceEmitter.emit('shtwords1lang', wrdSemihiddenGlob)
  } else {
    interfaceEmitter.emit('shtwords2tran', wrdSemihiddenGlob)
  }

  if(col_gl_taps >= wrdSemihiddenGlob.length + 1){ //add shift +1 for hide '-' characters 
    if (/*scope.sets*/dataGlobSettings.current_lang == "kor")
      //!!!!!!!!!!!!!!! document.getElementById("comm").innerHTML = "(" + commnt + ")"
    console.log("commnt")
  }
}

function next_taps(){
  console.log('next_taps', dataGlobDictionary[0] /*scope.dict[0]*/)
  loadNewLesson();
}



const scopeSetts = () => {return dataGlobSettings/*scope.sets*/}

// module.exports.myEmitter = myEmitter

export {/*localStorEmitter, */interfaceEmitter, scopeSetts}