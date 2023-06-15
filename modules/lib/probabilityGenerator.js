let objIndProbGlobal = []
let onceCall = true
const UNREPEAT_LENGTH = 6

function generateArrProbability(ind) {
  const x = (ind - 7) / 100
  // sinusoidal plot, 7 good piks on interval (-0.5; 5)
  const y = 9 * (2.71 ** (-1 * x + 0.7)) * Math.cos((4 * x + 5)) * Math.cos((4 * x + 1.35))
  return y
}

function generProbabilityPlotObj(len) {
  const objBufIndProb = []
  let arrXpoints2 = new Array(len).fill(0)
  arrXpoints2 = arrXpoints2.slice(0, 500)
  for (let i = 0; i < arrXpoints2.length; i++) {
    arrXpoints2[i] = generateArrProbability(i, arrXpoints2.length)
    if (arrXpoints2[i] < 0.03) arrXpoints2[i] = 0
    else objBufIndProb.push({ ind: i, prob: arrXpoints2[i] })
  }
  return objBufIndProb
}

function preparePropabilityVisualisation(len) {
  const probArr = generProbabilityPlotObj(len)
  const divArr = []
  let newGroupIndex = 0

  for (let i = 0; i < probArr.length; i++) {
    probArr[i].ind = len - probArr[i].ind // - 1
  }
  divArr.push([])
  divArr[newGroupIndex].push(probArr[0])
  for (let i = 1; i < probArr.length; i++) {
    const buf = JSON.parse(JSON.stringify(probArr[i]))
    if (probArr[i].ind === probArr[i - 1].ind - 1) {
      divArr[newGroupIndex].push(buf)
    } else {
      divArr.push([])
      newGroupIndex += 1
      divArr[newGroupIndex].push(buf)
    }
  }
  return divArr
}

function checkIndexBy() {
  let exArr = []
  let maxCall = 0
  return (indArr, max) => {
    maxCall += 1
    if (maxCall > 100) exArr = []
    const lengthUnrepSeq = (max < UNREPEAT_LENGTH * 2) ? Math.trunc(max / 2) : UNREPEAT_LENGTH
    if (exArr.includes(indArr)) {
      return true
    }
    exArr.push(indArr)
    if (exArr.length > lengthUnrepSeq) exArr.shift()
    maxCall = 0
    return false
  }
}
const checkIndexByAlreadyExist = checkIndexBy()

function randomChoiseFromPlotObj(len) {
  if (onceCall) {
    objIndProbGlobal = generProbabilityPlotObj(len)
    onceCall = false
  }
  let prblty = Math.random()
  let someInd = Math.ceil(Math.random() * objIndProbGlobal.length) - 1
  let goThis = true
  while (goThis) {
    if (objIndProbGlobal[someInd].prob < prblty) {
      someInd = Math.ceil(Math.random() * objIndProbGlobal.length) - 1
      prblty = Math.random()
    } else {
      goThis = false
      goThis = checkIndexByAlreadyExist(someInd, len)
      if (goThis) someInd = Math.ceil(Math.random() * objIndProbGlobal.length) - 1
    }
  }
  return len - objIndProbGlobal[someInd].ind - 1
}

function updateProbabilityArray(max) {
  objIndProbGlobal = generProbabilityPlotObj(max)
}

export { randomChoiseFromPlotObj, updateProbabilityArray, preparePropabilityVisualisation }
