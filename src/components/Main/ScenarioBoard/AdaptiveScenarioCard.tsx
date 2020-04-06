import React from 'react'
import { AllParams } from '../../../algorithms/types/Param.types'
import { AlgorithmResult } from '../../../algorithms/types/Result.types'
import * as ACData from 'adaptivecards-templating'
import * as AdaptiveCards from 'adaptivecards'

const templatePayload = {
  $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
  type: 'AdaptiveCard',
  version: '1.0',
  body: [
    {
      type: 'Container',
      items: [
        {
          type: 'TextBlock',
          text: '{scenario.name}',
          weight: 'bolder',
          size: 'medium',
        },
        {
          type: 'ColumnSet',
          columns: [
            {
              type: 'Column',
              width: 'auto',
              items: [
                {
                  type: 'TextBlock',
                  text: 'Created by',
                  weight: 'bolder',
                  wrap: true,
                },
                {
                  type: 'TextBlock',
                  text: 'Created on',
                  weight: 'bolder',
                  wrap: true,
                },
              ],
            },
            {
              type: 'Column',
              width: 'stretch',
              items: [
                {
                  type: 'TextBlock',
                  text: '{scenario.ownerEmail}',
                  isSubtle: true,
                  wrap: true,
                },
                {
                  type: 'TextBlock',
                  text: '{scenario.createdOn}',
                  isSubtle: true,
                  wrap: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  actions: [
    {
      type: 'Action.OpenUrl',
      title: 'Clone',
      url: '{scenario.url}',
    },
    {
      type: 'Action.Submit',
      title: 'Share',
      url: '{scenario.url}',
    },
    {
      type: 'Action.Submit',
      title: 'Delete',
    },
  ],
}

export interface AdaptiveScenarioCardProps {
  name: string
  ownerEmail: string
  createdOn: string
  url: string
  onDelete(name: string): void
  onShare(url: string): void
}

function AdaptiveScenarioCard({ name, ownerEmail, createdOn, url, onDelete, onShare }: AdaptiveScenarioCardProps) {
  // Create a Template instance from the template payload
  const template = new ACData.Template(templatePayload)

  // Create a data binding context, and set its $root property to the
  // data object to bind the template to
  const context = new ACData.EvaluationContext()
  context.$root = {
    scenario: {
      name,
      ownerEmail,
      createdOn,
      url,
    },
  }

  // "Expand" the template - this generates the final payload for the Adaptive Card,
  const payload = template.expand(context)

  // Create an AdaptiveCard instance
  const adaptiveCard = new AdaptiveCards.AdaptiveCard()

  // configure action logic
  adaptiveCard.onExecuteAction = (a: AdaptiveCards.Action) => {
    if (a instanceof AdaptiveCards.OpenUrlAction) {
      window.open(a.url, '_blank')
    } else if (a instanceof AdaptiveCards.SubmitAction && a.title === 'Delete') {
      onDelete(name)
    } else if (a instanceof AdaptiveCards.SubmitAction && a.title === 'Share') {
      onShare(url)
    }
  }

  // Set its hostConfig property unless you want to use the default Host Config
  // Host Config defines the style and behavior of a card
  adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
    fontFamily: 'Segoe UI, Helvetica Neue, sans-serif',
    // More host config options
  })

  adaptiveCard.hostConfig.fontFamily = 'Segoe UI, Helvetica Neue, sans-serif'
  adaptiveCard.hostConfig.containerStyles.default.backgroundColor = '#A0A6AB'

  // Parse the card payload
  adaptiveCard.parse(payload)

  const result = adaptiveCard.render()
  result.style.width = '300px'
  result.style.margin = '20px'
  return (
    <div
      ref={(n) => {
        if (n && result) {
          if (n.firstElementChild !== null) {
            n.removeChild(n.firstElementChild)
          }
          n.appendChild(result)
        }
      }}
    />
  )
}

export { AdaptiveScenarioCard }
