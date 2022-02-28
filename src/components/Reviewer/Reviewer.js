import PropTypes from "prop-types"
import React, { useState, useCallback } from 'react'
import ContextMenu from '../ContextMenu'
import ReviewForm from '../ReviewForm'

export default function Reviewer({
  target,
  eventType = 'mouseup',
  fields = {},
  authentication,
  repository,
  preppend = '',
  extraItems = [],
}) {
  console.log('Reviewer')

  const [issueQuote, setIssueQuote] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const handleOpen = useCallback(
    event => {
      const selection = window.getSelection()
      console.log({selection});
      if (!selection.isCollapsed) {
        event.preventDefault()
        const selectionText = selection.toString()

        /* Gets occurrence number of the selected text in target. */
        const getOccurrence = (selection, target) => {
          function getWord() {
            const txt = selection
            const txtRange = txt.getRangeAt(0)
            return txtRange
          }

          const t = getWord()
          const text = target
          const precedingRange = document.createRange()
          precedingRange.setStartBefore(text.firstChild)
          precedingRange.setEnd(t.startContainer, t.startOffset)

          const textPrecedingSelection = precedingRange.toString()
          const count =
            (
              textPrecedingSelection.match(
                new RegExp(t.toString().trim(), 'gi')
              ) || []
            ).length + 1

          return count
        }

        setIssueQuote({
          quote: selectionText,
          occurrence: getOccurrence(selection, target),
        })
        return true
      }
      return false
    },
    [target]
  )

  const handleReviewClick = () => {
    setShowReviewForm(true)
  }

  return (
    <>
      <ContextMenu
        items={[{ label: 'review', onClick: handleReviewClick }, ...extraItems]}
        target={target}
        eventType={eventType}
        onOpen={handleOpen}
      />
      <ReviewForm
        open={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        fields={fields}
        quote={issueQuote}
        repository={repository}
        authentication={authentication}
        preppend={preppend}
      />
    </>
  )
}

Reviewer.propTypes = {
  authentication: PropTypes.any,
  eventType: PropTypes.string,
  extraItems: PropTypes.array,
  fields: PropTypes.object,
  preppend: PropTypes.string,
  repository: PropTypes.any,
  target: PropTypes.any
}
