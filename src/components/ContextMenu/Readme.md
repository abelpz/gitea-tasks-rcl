A customizable context menu.

**Example:**

> **Tip:** Right click on text to tigger.

```js
import { useState, useCallback } from 'react'
import { Paper, Typography } from '@material-ui/core'

const Component = () => {
  const [target, setTarget] = useState(null)
  const getRef = useCallback(node => {
    setTarget(node)
  }, [])

  const items = [
    { label: 'copy', onClick: () => console.log('copy') },
    { label: 'cut', onClick: () => console.log('cut') },
    { label: 'paste', onClick: () => console.log('paste') },
  ]

  return (
    <Paper style={{ padding: '2rem' }}>
      <Typography ref={getRef} gutterBottom>
        Magna dolore enim qui irure ipsum. Ad ea anim reprehenderit sit excepteur proident reprehenderit commodo. Ea non eu elit amet pariatur elit enim consequat. Cupidatat non culpa laboris ea ea qui aliqua eu. Magna ut eu adipisicing esse irure.
      </Typography>
      <ContextMenu
        items={items}
        target={target}
      />
    </Paper>
  )
}

<Component />
```
