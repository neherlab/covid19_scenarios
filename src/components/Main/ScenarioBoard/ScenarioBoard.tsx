import React, { useState } from 'react'
import { AdaptiveScenarioCard } from './AdaptiveScenarioCard'
import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../../helpers/localStorage'
import { SavedScenario } from '../state/savedScenario'
import { Link } from 'react-router-dom'
import ShareScenarioDialog from './ShareScenarioDialog'

export default function ScenarioBoard() {
  // Read saved scenarios from local storage
  let existingSavedScenarios = LocalStorage.get<SavedScenario[]>(LOCAL_STORAGE_KEYS.SAVED_SCENARIOS)

  // if null, construct a new array
  if (!existingSavedScenarios) {
    existingSavedScenarios = []
  }
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(existingSavedScenarios)

  function onDeleteScenario(name: string) {
    const filteredScenarios = savedScenarios.filter((sc) => sc.name !== name)
    setSavedScenarios(filteredScenarios)
    LocalStorage.set(LOCAL_STORAGE_KEYS.SAVED_SCENARIOS, filteredScenarios)
  }

  const [showShareModal, setShowShareModal] = useState<boolean>(false)
  const [lastSharedScenario, setLastSharedScenario] = useState<string>('')
  const toggleShowShareModal = () => setShowShareModal(!showShareModal)

  function onShareScenario(url: string) {
    setShowShareModal(true)
    const hostUrl = window.location.host
    setLastSharedScenario(hostUrl + url)
  }

  // iterate through the collection and render the cards
  return savedScenarios.length > 0 ? (
    <>
      <div>
        {savedScenarios.map((sc) => {
          const creationTimeLocal: string = new Date(sc.creationTime).toLocaleString()
          return (
            <Link key={sc.name} to={sc.url}>
              <AdaptiveScenarioCard
                key={sc.name}
                name={sc.name}
                ownerEmail={sc.creator}
                createdOn={creationTimeLocal}
                url={sc.url}
                onDelete={onDeleteScenario}
                onShare={onShareScenario}
              />
            </Link>
          )
        })}
      </div>
      <ShareScenarioDialog
        showModal={showShareModal}
        toggleShowModal={toggleShowShareModal}
        scenarioUrl={lastSharedScenario}
      />
    </>
  ) : (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      No saved scenarios
    </div>
  )
}
