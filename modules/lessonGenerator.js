const EventEmitter = require('events');
const interfaceEmitter = new EventEmitter();
const localStorEmitter = new EventEmitter();
//------------------------------------------------------------------------------------------------------------------script


let scope = {}
let isScopeSet = false
let isHideTransl = false

function updateScope () {
  localStorEmitter.emit('updScope','uh')
}

localStorEmitter.on('scopeUpdated',(msg, msg2) => {
  scope.dict = JSON.parse(msg)
  scope.sets = JSON.parse(msg2)
  console.log('scopeUpdated')
  isScopeSet = true
  interfaceEmitter.emit('loadLessn')
})

function setLocalStorScope (key, val) {
  localStorEmitter.emit('setSets', key, val)
}
// updateScope()


  let words = [{la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}]
  let taps = []
  let col_gl_taps = 0
  // let socket = io();
  // socket.emit('refresh words', JSON.parse(localStorage.getItem('settings')).current_lang);


// document.getElementById("lang").innerHTML = words[0].la
// localStorage.setItem('settings', JSON.stringify({current_lang:"kor"})); 

// document.getElementsByClassName("lang_b")[0].addEventListener("click", add_taps)
// document.getElementsByClassName("tran_b")[0].addEventListener("click", add_taps)
// document.getElementsByClassName("next_b")[0].addEventListener("click", next_taps)
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


//-----Korean-----
function genJakubovichFieldKor(taps, lang_word){
  let taps_arr = []
  let taps_ind = []
  let max = 0
  // console.log(lang_word)
  for (var i = 0; i < lang_word.length; i++) {
    taps_arr.push(Math.random())/* = Math.random()*/
  }
  for (var i = 0; i < taps_arr.length; i++) {
    max = Math.max(...taps_arr)
    taps_ind[i] = taps_arr.indexOf(max);
    taps_arr[taps_ind[i]] = 0
  }
  return taps_ind
}

//-----Korean-----
function showCharactersByTapsKor(col_taps_ent, taps_array, init_word){
  //hide characters if no one touch, shift showing at one touch 
  if (col_taps_ent == 0) return ' '

  col_taps = col_taps_ent - 1

  if(col_taps >= init_word.length /*+ 1*/) col_taps = init_word.length /*+ 1 */// //add shift +1 for hide '-' characters 
  let crop_word = ''  
  for (var i = 0; i < init_word.length; i++) {
    if(init_word[i] == ' ')
      crop_word += ' '
    else      
      crop_word += 'ㅡ'       
  }
  for (var i = 0; i < col_taps; i++) {    
    crop_word = crop_word.substring(0,taps_array[i]) + init_word.substring(taps_array[i],taps_array[i]+1) + crop_word.substring(taps_array[i]+1) 
  }
  return crop_word
}

//-----English-----
function genJakubovichFieldEng(taps, lang_word){
  let taps_arr = []
  let taps_ind = []
  let max = 0
  for (var i = 0; i < Math.ceil(lang_word.length / 3); i++) {
    taps_arr.push(Math.random())/* = Math.random()*/
  }
  for (var i = 0; i < taps_arr.length; i++) {
    max = Math.max(...taps_arr)
    taps_ind[i] = taps_arr.indexOf(max);
    taps_arr[taps_ind[i]] = 0
  }
  return taps_ind
}

//-----English-----
function showCharactersByTapsEng(col_taps_ent, taps_array, init_word){
  //hide characters if no one touch, shift showing at one touch 
  if (col_taps_ent == 0) return ' '

  col_taps = col_taps_ent - 1 //3

  if(col_taps >= init_word.length /*+ 1*/) col_taps = init_word.length /*+ 1 */// //add shift +1 for hide '-' characters 
  let crop_word = ''  
  for (var i = 0; i < init_word.length; i++) {
    if(init_word[i] == ' ')
      crop_word += ' '
    else
      crop_word += '-'
  }
  for (var i = 0; i < col_taps; i++) {    
    crop_word = crop_word.substring(0,taps_array[i]*3) + init_word.substring(taps_array[i]*3,taps_array[i]*3+3) + crop_word.substring(taps_array[i]*3+3) 
  }
  return crop_word
}


let gen = []
let ini = ''
let wrd = ''
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
    gen = genJakubovichFieldKor("taps", ini)
    wrd = showCharactersByTapsKor(col_gl_taps, gen, ini)
  } else {
    gen = genJakubovichFieldEng("taps", ini)
    wrd = showCharactersByTapsEng(col_gl_taps, gen, ini)
  }
  // document.getElementById("lang").innerHTML = wrd//words[id].la
  // document.getElementById("tran").innerHTML = words[id].tr  
  // document.getElementById("comm").innerHTML = ''
  if(isHideTransl){
    interfaceEmitter.emit('shtwords1lang', wrd)
    interfaceEmitter.emit('shtwords2tran', words[id].tr)
  } else {
    interfaceEmitter.emit('shtwords2tran', wrd)
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
  x = (ind - 7) / 100 
  y = 9 * ( Math.pow(2.71,(-1*x + 0.7)) ) * Math.cos((4*x + 5)) * Math.cos((4*x + 1.35))  // 7 good piks on interval (-0.5; 5)
  return y
}


function generProbabilityPlotObj(len){
  arrXpoints2 = new Array(len).fill(0)
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
  // console.log("huek")
  if (/*JSON.parse(localStorage.getItem('settings'))*/scope.sets.current_lang == "kor"){
    
    // if(isHideTransl){
      col_gl_taps++
      wrd = showCharactersByTapsKor(col_gl_taps, gen, ini)
    // } else {
    //   col_gl_taps++
    //   wrd = showCharactersByTapsEng(col_gl_taps, gen, ini)      
    // }
  }
  else {
    //col_gl_taps+=3
    col_gl_taps++
    wrd = showCharactersByTapsEng(col_gl_taps, gen, ini)
  }

  
  // document.getElementById("lang").innerHTML = wrd

  if(isHideTransl){
    interfaceEmitter.emit('shtwords1lang', wrd)
  } else {
    interfaceEmitter.emit('shtwords2tran', wrd)
  }
  // 
  

  //console.log(col_gl_taps, wrd.length)
  // console.log(col_gl_taps, wrd.length)
  if(col_gl_taps >= wrd.length + 1){ //add shift +1 for hide '-' characters 
    if (/*JSON.parse(localStorage.getItem('settings'))*/scope.sets.current_lang == "kor")
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   document.getElementById("comm").innerHTML = "(" + commnt + ")"
    console.log("commnt")
  }
}

function next_taps(){
  console.log(scope.dict[0])
  loadNewLesson();
}

// try{
//   loadNewLesson();
// }catch(e){
//   console.log(e)
// }



//------------------------------------------------------------------------------------------------------------------script



// let good = 'norm'

// async function func(){

//   try {
//     let data = await fetch(
//       "https://sheets.googleapis.com/v4/spreadsheets/1csysK6t9agb7WFohdAKFcZUbACvZ3-qN8fhapcJtYYg/values/Kor_list?valueRenderOption=FORMATTED_VALUE&key=AIzaSyCWFhSQBc5xjNZyj8OEth3P9ZWNg83HDwo"
//     );
//     let { values } = await data.json();
//     let [, ...Data] = values.map((data) => data);
//     //return Data;
//     let datsss = JSON.stringify(Data).slice(0, 200)
//     console.log(datsss);
//     good = 'new data'
//     myEmitter.emit('gsheet words', datsss);
//   } catch {
//     console.log("Error");
//   }
// }

// func()

module.exports = {
  // Hello:"hello",
  // news: good,
  interfaceEmitter: interfaceEmitter,
  localStorEmitter: localStorEmitter,
  scope: () => {return scope.sets},
}

// module.exports.myEmitter = myEmitter