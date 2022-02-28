import PropTypes from 'prop-types'
import { Menu, MenuItem } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

export default function ContextMenu({
  target,
  eventType = 'contextmenu',
  onOpen = event => {
    event.preventDefault()
    return true
  },
  items = [],
}) {
  console.log('ContextMenu')

  const [position, setPosition] = useState(null)

  const onClose = () => {
    setPosition(null)
  }

  useEffect(() => {
    if (target) {
      const onContextMenu = event => {
        const open = onOpen(event)
        console.log({open})
        if (open) {
          setPosition(prevPosition =>
            prevPosition === null
              ? {
                  mouseX: event.clientX - 2,
                  mouseY: event.clientY - 4,
                }
              : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                // Other native context menus might behave different.
                // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null
          )
        }
      }
      target.addEventListener(eventType, onContextMenu)
      return () => {
        target.removeEventListener(eventType, onContextMenu)
      }
    }
  }, [target, eventType, onOpen])
  console.log({ position })
  return (
    <>
      <Menu
        open={position !== null}
        onClose={onClose}
        anchorReference='anchorPosition'
        anchorPosition={
          position !== null
            ? { top: position?.mouseY, left: position?.mouseX }
            : undefined
        }
      >
        {!items.length && (
          <MenuItem sx={{ px: '0.25rem!important' }} disabled>
            {'No items in this context menu'}
          </MenuItem>
        )}
        {items.map(({ label, onClick }, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              onClose()
              onClick()
            }}
            sx={{ px: '0.25rem!important' }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

ContextMenu.propTypes = {
  eventType: PropTypes.string,
  items: PropTypes.array,
  onOpen: PropTypes.func,
  target: PropTypes.shape({
    addEventListener: PropTypes.func,
    removeEventListener: PropTypes.func,
  }),
}
