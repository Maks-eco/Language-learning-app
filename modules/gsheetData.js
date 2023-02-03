const EventEmitter = require('events');
const myEmitter = new EventEmitter();

let good = 'norm'

async function funcFunc(lang_c){

  try {
    console.log(lang_c)
    const lang = (lang_c == 'kor') ? 'Kor_list' : 'Eng_list'
    let data = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1csysK6t9agb7WFohdAKFcZUbACvZ3-qN8fhapcJtYYg/values/${lang}?valueRenderOption=FORMATTED_VALUE&key=AIzaSyCWFhSQBc5xjNZyj8OEth3P9ZWNg83HDwo`
    );
    let { values } = await data.json();
    let [, ...Data] = values.map((data) => data);
    //return Data;
    let arr_la_tr_co = []
    Data.forEach((row) => {
      arr_la_tr_co.push({la:row[0],tr:row[1],co:row[2]})
    });
  // return arr_la_tr_co
    let datsss = JSON.stringify(arr_la_tr_co)//.slice(0, 200)
    //console.log(datsss);
    good = 'new data'
    myEmitter.emit('gsheet words', datsss);
  } catch {
    console.log("Error");
  }
}

myEmitter.on('gsheetwordsupd', async (lang) =>{
  console.log(lang)
  funcFunc(lang)
})


module.exports = {
  Hello:"hello",
  news: good,
  myEmitter: myEmitter
}

// module.exports.myEmitter = myEmitter