import React, { useState, useEffect } from 'react'
import createPersistedState from 'use-persisted-state'
import { v4 as uuidv4 } from 'uuid'
import { Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import jestDiff from 'jest-diff'
import isEqual from 'is-equal'
import _ from 'lodash'

import { Scenario, SavedScenariosState, DEFAULT_SCENARIO_ID, ScenarioParams } from '.'
import Main from '../Main/Main'
import SaveScenarioDialog from './SaveScenarioDialog'
import ShareScenarioDialog from './ShareScenarioDialog'
import { AlgorithmResult } from '../../algorithms/types/Result.types'

import './MultipleScenarios.scss'

const useSavedScenariosState = createPersistedState('savedScenarios')
const useUserState = createPersistedState('user')

export default function MultipleScenarios() {
  const [user, setUser] = useUserState({ version: 1, id: uuidv4(), handleForSharedLinks: '' })
  const [savedScenarios, setSavedScenarios] = useSavedScenariosState<SavedScenariosState>({
    version: 1,
    scenarios: [{ id: DEFAULT_SCENARIO_ID, userid: user.id, name: 'Customize', params: null }],
  })
  const [scenarios, setScenarios] = useState<Scenario[]>(savedScenarios.scenarios)
  const [activeTab, setActiveTab] = useState(DEFAULT_SCENARIO_ID)
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false)
  const [showShareModal, setShowShareModal] = useState<boolean>(false)

  const activeScenario = scenarios.find((scenario) => scenario.id === activeTab) || scenarios[0]

  function onScenarioSave(name: string) {
    if (activeScenario) {
      const newScenario = { id: uuidv4(), userid: user.id, name, params: activeScenario.params }
      setSavedScenarios({
        version: 1,
        scenarios: [...savedScenarios.scenarios, newScenario],
      })
      setScenarios([...scenarios, newScenario])
    }
  }

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  function generateShareableLink(name: string, createdBy: string): string {
    if (createdBy !== user.handleForSharedLinks) {
      setUser({ ...user, handleForSharedLinks: createdBy })
    }

    const toSerialize = _.cloneDeep({
      version: 1,
      id: activeScenario.id !== DEFAULT_SCENARIO_ID ? activeScenario.id : uuidv4(),
      userid: user.id,
      name,
      createdBy,
      params: activeScenario.params,
    })
    delete toSerialize.params?.scenarioState.scenarios
    const baseURL = window.location.href.split('?')[0]
    return `${baseURL}?${btoa(unescape(encodeURIComponent(JSON.stringify(toSerialize))))}`
  }

  useEffect(() => {
    try {
      const shareableLink = window.location.search.slice(1)
      if (shareableLink) {
        const fromLink = JSON.parse(decodeURIComponent(escape(atob(shareableLink))))
        const existing = savedScenarios.scenarios.find((scenario) => scenario.id === fromLink.id)
        if (!existing) {
          delete fromLink.version
          setSavedScenarios({
            version: 1,
            scenarios: [...savedScenarios.scenarios, fromLink],
          })
        }
        setActiveTab(fromLink.id)
      }
    } catch (error) {
      console.error('Error while parsing URL :', error.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onScenarioDelete() {
    if (activeTab !== DEFAULT_SCENARIO_ID) {
      const toDelete = activeTab
      setActiveTab(DEFAULT_SCENARIO_ID)
      setSavedScenarios({
        version: 1,
        scenarios: savedScenarios.scenarios.filter((scenario) => scenario.id !== toDelete),
      })
      setScenarios(scenarios.filter((scenario) => scenario.id !== toDelete))
    }
  }

  function handleChangedParameters(params: ScenarioParams) {
    // Note: isEqual handles Date() objects while lodash.isEqual does not.
    const different = !isEqual(activeScenario.params, params)

    console.log(`hoisted params. different: ${different}`)
    if (!activeScenario.params) {
      console.log('initial params')
    } else {
      console.log('existing params')
      console.log(
        jestDiff(activeScenario.params, params, {
          expand: false,
          contextLines: 2,
          aAnnotation: 'was',
          bAnnotation: 'is',
        }),
      )
    }

    if (different || (!activeScenario.params && params)) {
      updateScenario(activeScenario.id, { params })
    }
  }

  function handleChangedResult(result: AlgorithmResult) {
    // Note: isEqual handles Date() objects while lodash.isEqual does not.
    const different = !isEqual(activeScenario.result, result)

    console.log(`hoisted result. different: ${different}`)
    if (!activeScenario.result) {
      console.log('initial result')
    } else {
      console.log('existing result')
      console.log(
        jestDiff(activeScenario.result, result, {
          expand: false,
          contextLines: 2,
          aAnnotation: 'was',
          bAnnotation: 'is',
        }),
      )
    }

    if (different || (!activeScenario.result && result)) {
      updateScenario(activeScenario.id, { result })
    }
  }

  function updateScenario(id: string, update: Partial<Scenario>) {
    setScenarios(scenarios.map((scenario) => (scenario.id === id ? { ...scenario, ...update } : scenario)))
  }

  return (
    <div className="multiple-scenarios">
      {savedScenarios.scenarios.length > 1 && (
        <Nav tabs>
          {savedScenarios.scenarios.map((scenario) => (
            <NavItem key={scenario.id}>
              <NavLink
                className={classnames({ active: activeTab === scenario.id })}
                onClick={() => {
                  toggleTab(scenario.id)
                }}
              >
                <h5>{scenario.name}</h5>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      )}
      <Main
        incomingParams={activeScenario.params}
        onParamChange={handleChangedParameters}
        incomingResult={activeScenario.result || null}
        onResultChange={handleChangedResult}
        onScenarioSave={() => {
          setShowSaveModal(true)
        }}
        onScenarioShare={() => {
          setShowShareModal(true)
        }}
        onScenarioDelete={activeTab !== DEFAULT_SCENARIO_ID ? onScenarioDelete : undefined}
      />
      {showShareModal && activeScenario && (
        <ShareScenarioDialog
          scenario={activeScenario}
          createdBy={user.handleForSharedLinks}
          generateLink={generateShareableLink}
          onCloseDialog={() => setShowShareModal(false)}
        />
      )}
      {showSaveModal && (
        <SaveScenarioDialog
          onSave={(name: string) => {
            onScenarioSave(name)
            setShowSaveModal(false)
          }}
          onCloseDialog={() => setShowSaveModal(false)}
        />
      )}
    </div>
  )
}
