import { storeData, getData } from './localStorage';
let promiseGoogleSheet = require('./gsheetData').promiseDataGsheet

// let lsEmiter = require('./lessonGenerator').localStorEmitter;
// import { localStorEmitter } from './lessonGenerator';
// let lsEmiter = localStorEmitter

const data = {
  dictionary: [
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
    {la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}, 
  ],
  settings: {current_lang:'kor',kor:{min:0,max:10},eng:{min:0,max:10},hide:0},
}

async function init(){
  getData('settings')
  .then((data) =>{ 
    data = JSON.parse(data)
    console.log(data.current_lang)
    // emiterGoogleSheet.emit('gsheetwordsupd', data.current_lang)
    promiseGoogleSheet(data.current_lang)
  .then((msg)=>{
    storeData('dictionary', msg);
  /* console.log('ok')*/
  })
  .catch((e)=>{console.log(e)})
  }).catch(e => {
    console.log(e)
  })
} 
 
init()

// lsEmiter.on('updScope', async () => {
//   sendScope()

// }).on('getData', (msg) => {
   
// })

// async function sendScope(){
//   Promise.all([
//     //ert(),
//     getData('dictionary'), 
//     getData('settings')
//   ]).then(results => {
//      // console.log(results);
//      lsEmiter.emit('scopeUpdated', results[0],results[1])
//      // console.log("scopeUtytytytytys")
//   }).catch(e => {
//     console.log(e)
//     storeData('dictionary', JSON.stringify(data.dictionary ))
//     storeData('settings', JSON.stringify({current_lang:'kor',kor:{min:0,max:10},eng:{min:0,max:10},hide:0}))
    
//     setTimeout(()=>{
//       // intEmiter.emit('attch', 'attch')
//       // console.log("tytytytytys")
//       sendScope()
//     }, 1000)
//     // sendScope()
//     // intEmiter.emit('attch', 'attch')
//   })
// }

function sendScope(){
  return new Promise((resolve) => {
    Promise.all([
      //ert(),
      getData('dictionary'), 
      getData('settings')
    ]).then(results => {
       
       // lsEmiter.emit('scopeUpdated', results[0],results[1]) ------------------------------------------- ! 
       
       resolve({ms1: results[0], ms2: results[1]})
    }).catch(e => {
      console.log(e)
      storeData('dictionary', JSON.stringify(data.dictionary /*[{la: "말이 없습니다", tr: "no words", co: "mal-i eobs-seubnida"}]*/))
      storeData('settings', JSON.stringify({current_lang:'kor',kor:{min:0,max:10},eng:{min:0,max:10},hide:0}))
      
      setTimeout(()=>{
        // intEmiter.emit('attch', 'attch')
        // console.log("tytytytytys")
        sendScope()
      }, 1000)
      // sendScope()
      // intEmiter.emit('attch', 'attch')
    })
  })
}


/*async*/ function sendScopeSettings(e){ //get data from input element from settings, then save it in localStorage
   storeData('settings', e)
    sendScope().then(()=>{
      console.log('Bun in oven 2')
      return init()
    }).then(()=>{
      sendScope()
    }).then(()=>{
      console.log('Zapecheno 2')
    }).catch((e)=>{console.log(e)})
}

export { sendScopeSettings, sendScope }