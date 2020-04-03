import i18n from 'i18next'
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { AlgorithmResult } from '../types/Result.types'
import { exportSimulation } from '../model'
import { ScenarioCardId, ScenarioCardContainmentId } from '../../components/Main/Scenario/ScenarioCard'
import { OutcomeRatesTableId, DeterministicLinePlotId, AgeBarChartId } from '../../components/Main/Results/ResultsCard'

export function isBlobApiSupported() {
  try {
    return !!new Blob()
  } catch (error) {
    return false
  }
}

export function saveFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, filename)
}

export async function exportAll(result: AlgorithmResult) {
  if (!result) {
    throw new Error(`Algorithm result expected, but got ${result}`)
  }

  const { deterministic, params } = result

  if (!(deterministic || params)) {
    console.error('Error: the results, and params, of the simulation cannot be exported')
    return
  }

  const zip = new JSZip()

  if (!params) {
    console.error('Error: the params of the simulation cannot be exported because they are null')
  } else {
    zip.file('covid.params.json', JSON.stringify(params, null, 2))
  }

  if (!deterministic) {
    console.error('Error: the results of the simulation cannot be exported because they are nondeterministic')
  } else {
    zip.file('covid.results.deterministic.tsv', exportSimulation(deterministic))
  }

  const zipFile = await zip.generateAsync({ type: 'blob' })
  saveAs(zipFile, 'covid.params.results.zip')
}

export function exportResult(result: AlgorithmResult) {
  if (!result) {
    throw new Error(`Algorithm result expected, but got ${result}`)
  }

  const { deterministic } = result

  if (!isBlobApiSupported()) {
    // TODO: Display an error popup
    console.error('Error: export is not supported in this browser: `Blob()` API is not implemented')
    return
  }

  if (!deterministic) {
    console.error('Error: the results of the simulation cannot be exported because they are nondeterministic')
    return
  }

  saveFile(exportSimulation(deterministic), 'covid.results.deterministic.tsv')
}

export function exportParams(result: AlgorithmResult) {
  if (!result) {
    throw new Error(`Algorithm result expected, but got ${result}`)
  }

  const { params } = result

  if (!isBlobApiSupported()) {
    // TODO: Display an error popup
    console.error('Error: export is not supported in this browser: `Blob()` API is not implemented')
    return
  }

  if (!params) {
    console.error('Error: the params of the simulation cannot be exported because they are null')
    return
  }

  saveFile(JSON.stringify(params, null, 2), 'covid.params.json')
}

export async function exportPDF(result: AlgorithmResult) {
  if (!result) {
    throw new Error(`Algorithm result expected, but got ${result}`)
  }

  const { deterministic, params } = result

  if (!(deterministic || params)) {
    console.error('Error: the results, and params, of the simulation cannot be exported')
    return
  }

  var deterministicLinePlot = document.getElementById(DeterministicLinePlotId)
  var ageBarChart = document.getElementById(AgeBarChartId)
  var outcomesRatesTable = document.getElementById(OutcomeRatesTableId)
  var scenarioCard = document.getElementById(ScenarioCardId)
  var scenarioCardContainment = document.getElementById(ScenarioCardContainmentId)
  
  var doc = new jsPDF()
  doc.setFontSize(22)
  doc.text(20, 20, i18n.t('Export simulation'))
  var currentHeight = 30
  currentHeight = await addElementToPdf(doc, currentHeight, scenarioCard)
  currentHeight = await addElementToPdf(doc, currentHeight, scenarioCardContainment)
  currentHeight = await addElementToPdf(doc, currentHeight, deterministicLinePlot)
  currentHeight = await addElementToPdf(doc, currentHeight, ageBarChart)
  await addElementToPdf(doc, currentHeight, outcomesRatesTable)
  
  doc.save('covid.params.results.pdf')
}

//adds element to pdf and returns the currentHeight
async function addElementToPdf(doc:jsPDF, currentHeight:number, element:HTMLElement | null):Promise<number> {
  var headerMargin = 30
  var topMargin = 5
  var sideMargin = 20
  if(element != null) {
    var pngImage = await domtoimage.toPng(element)
    var elementWidth = doc.internal.pageSize.width - sideMargin * 2
    var elementHeight = (elementWidth / element.offsetWidth * element.offsetHeight)
    if(currentHeight + elementHeight > doc.internal.pageSize.height) {
      doc.addPage()
      currentHeight = headerMargin
    }
    doc.addImage(pngImage, 'PNG', sideMargin, currentHeight, elementWidth, elementHeight)
    currentHeight += elementHeight + topMargin
  }
  return currentHeight
}