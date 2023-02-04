const EventEmitter = require('events');
const interfaceEmitter = new EventEmitter();
// const localStorEmitter = new EventEmitter();
//------------------------------------------------------------------------------------------------------------------script
import { sendScope } from './updateStateController';

let scope = {}
let isScopeSet = false
let isHideTransl = false

function updateScope () {
  // localStorEmitter.emit('updScope','uh')
  sendScope().then((msg)=>{ 
    // console.log(msg.ms1, msg.ms2)
    scope.dict = JSON.parse(msg.ms1)
    scope.sets = JSON.parse(msg.ms2)
    console.log('scopeUpdated')
    isScopeSet = true
    interfaceEmitter.emit('loadLessn')
  })
}


  let words = [{la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}]
  let taps = []
  let col_gl_taps = 0

interfaceEmitter.on('resp1', (msg) => {
  try { 
    isScopeSet && add_taps()
  } catch(e) {    
    console.log(e)
  }
}).on('resp2', (msg) => {
  try {
    isScopeSet && add_taps()  
  } catch(e) {
    console.log(e)
  }
}).on('resp3', (msg) => {
  try {  
    isScopeSet && next_taps()
  } catch(e) {
    console.log(e)
  }
}).on('attch', (msg) => {
  try {
    if(isScopeSet){
      console.log('attch: ' + msg);   
      loadNewLesson()
      updateScope()
    } else {
      updateScope()
    }
  } catch(e) {
    console.log(e)
  }
}).on('loadLessn', (msg) => {
  try {    
    console.log('loadLessn');  
    onceCall = true 
    loadNewLesson()      
  } catch(e) {
    console.log(e)
  }
})



function genRandomChunksFieldKor(taps, lang_word){//-----Korean-----
  let taps_arr = []
  for (var i = 0; i < lang_word.length; i++) {
    taps_arr.push(Math.random())/* = Math.random()*/
  }
  return toSequenceShowingPartsOfWords(taps_arr)
}
function genRandomChunksFieldEng(taps, lang_word){//-----English-----
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


let gen = []
let ini = ''
let wrdGlob = ''
let commnt = ''
let max_train = 0
let min_train = 0
let settings = {}

function showAllById(id = 0){
  taps = []
  col_gl_taps = 0
  if (isHideTransl) { 
    ini = words[id].la
  } else {
    ini = words[id].tr
  }    
  commnt = words[id].co
  console.log(ini)
  if (settings.current_lang == "kor"){
    gen = genRandomChunksFieldKor("taps", ini)
    wrdGlob = showCharactersByTapsKor(col_gl_taps, gen, ini)
  } else {
    gen = genRandomChunksFieldEng("taps", ini)
    wrdGlob = showCharactersByTapsEng(col_gl_taps, gen, ini)
  }
  if(isHideTransl){
    interfaceEmitter.emit('shtwords1lang', wrdGlob)
    interfaceEmitter.emit('shtwords2tran', words[id].tr)
  } else {
    interfaceEmitter.emit('shtwords2tran', wrdGlob)
    interfaceEmitter.emit('shtwords1lang', words[id].la)
  }    
}

function loadNewLesson(){
  let sets
  let sets_ls = scope.sets//JSON.parse(localStorage.getItem('settings'))
  switch (scope.sets.hide){
    case 0:
      isHideTransl = true
    break
    case 1:
      isHideTransl = false
    break
    case 2:
      isHideTransl = (Math.random() > 0.5) ? false : true
    break
    default:
      isHideTransl = true
  }
  // console.log(sets_ls)
  if (typeof(sets_ls)==="undefined" || sets_ls===null){
    settings.current_lang = 'kor'
  } else {
    settings = sets_ls
  }

  switch (settings.current_lang){
    case 'kor':
      sets = settings.kor
    break
    case 'eng':
      sets = settings.eng
    break
    default:
      sets = settings.kor
  }

  let wor_d = scope.dict//JSON.parse(localStorage.getItem('dictionary'));

  if (typeof(wor_d)==="undefined" || wor_d===null){

  }else{
    words = wor_d
  }
  
  
  if (typeof(sets)==="undefined" || sets===null){
    showAllById(teachRandom(0,words.length - 1))
  } else {
    max_train = sets.max
    min_train = sets.min
    if(max_train > (words.length - 1)) max_train = words.length - 1
    showAllById(teachRandom(min_train,max_train))
  }
  //console.log(words.length)
  
}

let exArr = []
let objIndProb = []
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
      else objIndProb.push({ind: i, prob: arrXpoints2[i]})
  }
}



function randomChoiseFromPlotObj(len){
  if(onceCall){
    generProbabilityPlotObj(len)
    onceCall = false
  }
  
  let prblty = Math.random()
  //if(prblty < getMinY(objIndProb)) prblty += 0.01
  let someInd = Math.ceil( Math.random() * objIndProb.length ) - 1
  let goThis = true
  while(goThis){
    if (objIndProb[someInd].prob < prblty /*&& objIndProb[someInd].prob > prblty / 0.8*/){
      someInd = Math.ceil( Math.random() * objIndProb.length ) - 1 
      //prblty -= 0.01
      prblty = Math.random()
    }else{
      goThis = false
      goThis = chechIndexByAlreadyExist(someInd)
      if(goThis) someInd = Math.ceil( Math.random() * objIndProb.length ) - 1 
    }
  }
  return len - objIndProb[someInd].ind - 1
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

  if (/*JSON.parse(localStorage.getItem('settings'))*/scope.sets.current_lang == "kor"){
    
    // if(isHideTransl){
      col_gl_taps++
      wrdGlob = showCharactersByTapsKor(col_gl_taps, gen, ini)
    // } else {
    //   col_gl_taps++
    //   wrdGlob = showCharactersByTapsEng(col_gl_taps, gen, ini)      
    // }
  }
  else {
    //col_gl_taps+=3
    col_gl_taps++
    wrdGlob = showCharactersByTapsEng(col_gl_taps, gen, ini)
  }

  
  // document.getElementById("lang").innerHTML = wrdGlob

  if(isHideTransl){
    interfaceEmitter.emit('shtwords1lang', wrdGlob)
  } else {
    interfaceEmitter.emit('shtwords2tran', wrdGlob)
  }
  // 
  

  //console.log(col_gl_taps, wrdGlob.length)
  // console.log(col_gl_taps, wrdGlob.length)
  if(col_gl_taps >= wrdGlob.length + 1){ //add shift +1 for hide '-' characters 
    if (/*JSON.parse(localStorage.getItem('settings'))*/scope.sets.current_lang == "kor")
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   document.getElementById("comm").innerHTML = "(" + commnt + ")"
    console.log("commnt")
  }
}

function next_taps(){
  console.log(scope.dict[0])
  loadNewLesson();
}



const scopeSetts = () => {return scope.sets}

// module.exports.myEmitter = myEmitter

export {/*localStorEmitter, */interfaceEmitter, scopeSetts}