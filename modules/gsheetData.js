async function funcFunc(langCurr, link, key, listNameTable) {
  try {
    const dataSheet = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${link}/values/${listNameTable}?valueRenderOption=FORMATTED_VALUE&key=${key}`,
    )
    const { values } = await dataSheet.json()
    const [...resData] = values.map((data, ind) => {
      if (!data[0]) data[0] = `_empty_${ind + 1}_cell_`
      if (!data[1]) data[1] = `_empty_${ind + 1}_cell_`
      return data
    })
    const dictArray = []
    resData.forEach((row) => {
      dictArray.push({ la: row[0], tr: row[1], co: row[2] })
    })
    if (dictArray.length < 3) { throw new Error('Array too small') }
    const datsss = JSON.stringify(dictArray)
    return datsss
  } catch (e) {
    console.log('Error')
    console.log(e)
    throw new Error('gSheet connection')
  }
}

function promiseDataGsheet(langCurr, link, key, listNameTable) {
  return new Promise((resolve, reject) => {
    try {
      const res = funcFunc(langCurr, link, key, listNameTable)
      resolve(res)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  promiseDataGsheet,
}
