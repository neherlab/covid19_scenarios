import React, { useState, useEffect } from 'react'
import createPersistedState from 'use-persisted-state'
import { v4 as uuidv4 } from 'uuid'
import { Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'

import Main from '../Main/Main'
import ShareScenarioDialog from './ShareScenarioDialog'
import { DEFAULT_SCENARIO_ID } from '../Main/state/state'

import './MultipleScenarios.scss'

const useSavedScenariosState = createPersistedState('savedScenarios')
const useUserState = createPersistedState('user')

export default function MultipleScenarios() {
  const [user, setUser] = useUserState({ version: 1, id: uuidv4(), handleForSharedLinks: '' })
  const [savedScenarios, setSavedScenarios] = useSavedScenariosState({ version: 1, scenarios: [] })
  const [activeTab, setActiveTab] = useState(DEFAULT_SCENARIO_ID)
  const [showShareModal, setShowShareModal] = useState<boolean>(false)
  const [serializedScenarioToShare, setSerializedScenarioToShare] = useState<string>('')

  function onScenarioSave(name: string, serializedScenario: string) {
    setSavedScenarios({
      version: 1,
      scenarios: [...savedScenarios.scenarios, { id: uuidv4(), userid: user.id, name, serializedScenario } as never],
    })
  }

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const allScenarios = [
    { id: DEFAULT_SCENARIO_ID, userid: user.id, name: 'Customize', serializedScenario: null },
    ...savedScenarios.scenarios,
  ]

  const activeScenario =
    activeTab === DEFAULT_SCENARIO_ID
      ? allScenarios[0]
      : allScenarios.find((saved) => activeTab === saved.id) || allScenarios[0]

  function generateShareableLink(name: string, createdBy: string): string {
    if (createdBy !== user.handleForSharedLinks) {
      setUser({ ...user, handleForSharedLinks: createdBy })
    }

    const toSerialize = {
      version: 1,
      id: activeScenario.id !== DEFAULT_SCENARIO_ID ? activeScenario.id : uuidv4(),
      userid: user.id,
      name,
      createdBy,
      serializedScenario: serializedScenarioToShare,
    }
    const baseURL = window.location.href.split('?')[0]
    return `${baseURL}?${btoa(JSON.stringify(toSerialize))}`
  }

  useEffect(() => {
    try {
      const shareableLink = window.location.search.slice(1)
      if (shareableLink) {
        const fromLink = JSON.parse(atob(shareableLink))
        const existing = allScenarios.find((scenario) => scenario.id === fromLink.id)
        if (!existing) {
          delete fromLink.version
          setSavedScenarios({
            version: 1,
            scenarios: [...savedScenarios.scenarios, fromLink as never],
          })
        }
        setActiveTab(fromLink.id)
      }
    } catch (error) {
      console.error('Error while parsing URL :', error.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="multiple-scenarios">
      {savedScenarios.scenarios.length > 0 && (
        <Nav tabs>
          {allScenarios.map((scenario) => (
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
        activeScenario={activeScenario}
        onScenarioSave={onScenarioSave}
        onScenarioShare={(serializedScenario) => {
          setSerializedScenarioToShare(serializedScenario)
          setShowShareModal(true)
        }}
      />
      {showShareModal && (
        <ShareScenarioDialog
          scenario={activeScenario}
          createdBy={user.handleForSharedLinks}
          generateLink={generateShareableLink}
          onCloseDialog={() => setShowShareModal(false)}
        />
      )}
    </div>
  )
}
