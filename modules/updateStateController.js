import { storeData, getData } from './localStorage'

const promiseGoogleSheet = require('./gsheetData').promiseDataGsheet

export let dataGlobDictionary = Array(10).fill(
  { la: '말이 없습니다', tr: 'no words', co: 'mal-i eobs-seubnida' },
)

export let dataGlobSettings = {
  currentLang: 'kor',
  kor: { min: 0, max: 10, list: '' },
  eng: { min: 0, max: 10, list: '' },
  hide: 'bth',
  table: '',
  key: '',
}

function checkUserInput() {
  const undArr = []
  for (const item of arguments) {
    undArr.push(void 0)
  }
  try {
    let existEmpty = false
    for (const item of arguments) {
      if (!item || item == '') existEmpty = true
    }
    if (existEmpty) {
      return undArr
    }
    return arguments
  } catch (e) {
    console.log(e)
    return undArr
  }
}

async function init() {
  getData('dictionary')
    .then((res) => { dataGlobDictionary = JSON.parse(res) })
    .then(() => getData('settings'))
    .then((res) => {
      dataGlobSettings = JSON.parse(res)

      const chnk = JSON.parse(res)
      const [table, key, list] = checkUserInput(chnk.table, chnk.key, chnk[chnk.currentLang].list)

      promiseGoogleSheet(chnk.currentLang, table, key, list)
        .then((msg) => {
          storeData('dictionary', msg)
          dataGlobDictionary = JSON.parse(msg)
        })
        .catch((e) => {
          console.log(e)
        })
    })
    .catch((e) => {
      storeData('settings', JSON.stringify(dataGlobSettings))
        .then(() => storeData('dictionary', JSON.stringify(dataGlobDictionary)))
        .then(() => {
          console.log('secnd attempt')
          init()
        })
    })
}
init()

function sendScope() {
  return new Promise((resolve) => {
    Promise.all([
      getData('dictionary'),
      getData('settings'),
    ])
      .then((results) => {
        dataGlobDictionary = JSON.parse(results[0])
        dataGlobSettings = JSON.parse(results[1])
        resolve({ dict: results[0], sets: results[1] })
      })
      .catch(() => {
        storeData('dictionary', JSON.stringify(dataGlobDictionary))
          .then(() => {
            storeData('settings', JSON.stringify(dataGlobSettings))
          })
          .then(() => sendScope())
          .then((results) => {
            console.log('double rebuilded')
            resolve(results)
          })
      })
  })
}

function sendScopeSettings(value) { // get data from input element from settings, then save it in localStorage
  const data = JSON.parse(value)
  if (data[data.currentLang].max < 3) data[data.currentLang].max = 3
  const newValue = JSON.stringify(data)
  storeData('settings', newValue).then(() => init())
}

export { sendScopeSettings, sendScope }
