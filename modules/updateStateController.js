import { storeData, getData } from './localStorage';
let promiseGoogleSheet = require('./gsheetData').promiseDataGsheet

export let dataGlobDictionary = [
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
  ]

export let dataGlobSettings = {current_lang:'kor',kor:{min:0,max:10},eng:{min:0,max:10},hide:'bth'}

async function init(){
  getData('dictionary')
    .then((res) =>{  dataGlobDictionary = JSON.parse( res)  })
    .then(() => getData('settings'))
    .then((res) =>{ 
      dataGlobSettings = JSON.parse( res)

      let chnk = JSON.parse(res)
      promiseGoogleSheet(chnk.current_lang)
        .then((msg)=>{
          storeData('dictionary', msg);
          dataGlobDictionary = JSON.parse( msg)
        /* console.log('ok')*/
        })
        .catch((e)=>{
          console.log(e)
        })
    })
    .catch(e => {
      // console.log(e.name)
      storeData('settings', JSON.stringify(dataGlobSettings  ))
        .then(()=>  storeData('dictionary', JSON.stringify(dataGlobDictionary  )))        
        .then(()=> {
          console.log('secnd attempt')
          init()
        })      
    })    
}  
init()


function sendScope(){
  return new Promise((resolve) => {    
    Promise.all([      
      //ert(),
      getData('dictionary'), 
      getData('settings')
    ])
    .then(results => {
      dataGlobDictionary = JSON.parse( results[0])
      dataGlobSettings = JSON.parse( results[1])
      // console.log(dataGlobSettings)
       resolve({dict: results[0], sets: results[1]})
    })
    .catch(() => {
      // console.log(e)
      storeData('dictionary', JSON.stringify(dataGlobDictionary /*dataGlob.dictionary */))
        .then(() => {
          storeData('settings', JSON.stringify(dataGlobSettings /*dataGlob.settings*/ ))
        })
        .then(() =>   sendScope() )
        .then(results => {
          console.log('double rebuilded')
          resolve(results)
        })
    })
  })
}


function sendScopeSettings(e){ //get data from input element from settings, then save it in localStorage
   // console.log(e)
   let data = JSON.parse(e)
   if (data[data.current_lang].max < 3) data[data.current_lang].max = 3
   e = JSON.stringify(data)
  storeData('settings', e).then(() => init()  )
}

export { sendScopeSettings, sendScope }