// const EventEmitter = require('events');
// const myEmitter = new EventEmitter();

// let good = 'norm'

async function funcFunc(lang_c, link, key, listNameTable){
// `https://sheets.googleapis.com/v4/spreadsheets/1csysK6t9agb7WFohdAKFcZUbACvZ3-qN8fhapcJtYYg/values/${lang}?valueRenderOption=FORMATTED_VALUE&key=AIzaSyCWFhSQBc5xjNZyj8OEth3P9ZWNg83HDwo`
  if(!link) link = '1csysK6t9agb7WFohdAKFcZUbACvZ3-qN8fhapcJtYYg'
  if(!key)  key = 'AIzaSyCWFhSQBc5xjNZyj8OEth3P9ZWNg83HDwo'

  try {
    let lang = (lang_c == 'kor') ? 'Kor_list' : 'Eng_list' // 'Test_list' 
    if(listNameTable) lang = listNameTable
    let data = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${link}/values/${lang}?valueRenderOption=FORMATTED_VALUE&key=${key}`
    );
    let { values } = await data.json();
    let [...Data] = values.map((data, ind) => {
      if (!data[0]) data[0] = `_empty_${ind+1}_cell_`
      if (!data[1]) data[1] = `_empty_${ind+1}_cell_`
      return data
    });
// console.log(Data)
    let arr_la_tr_co = []
    Data.forEach((row) => {
      arr_la_tr_co.push({la:row[0],tr:row[1],co:row[2]})
    });
    // console.log(arr_la_tr_co)
    // arr_la_tr_co = ['some', 'too some']
    if (arr_la_tr_co.length < 3){ /*console.log('Array too small')*/ throw new Error('Array too small' )}
    let datsss = JSON.stringify(arr_la_tr_co)//.slice(0, 200)
    //console.log(datsss);

    return datsss
  } catch (e){
    console.log("Error");
    console.log(e);
    // return throw Error
    throw new Error('gSheet connection')
  }
}

function promiseDataGsheet (lang_c, link, key, listNameTable){
  return new Promise((resolve, reject) => {
    try{
      const res = funcFunc(lang_c, link, key, listNameTable)      
      resolve(res)
    }catch (err){
      reject(err)
    }
  })
}


module.exports = {
  Hello:"hello",
  promiseDataGsheet: promiseDataGsheet,
}
