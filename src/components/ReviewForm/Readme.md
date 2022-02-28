A dialog with a form to submit a review request.

**Example:**

> **Tip:** Click the button to open dialog

```js
import { useState } from 'react'
import { Button } from '@material-ui/core';

//Dummy authenticataion
  const authentication = {
    token: { sha1: "dummytoken" },
    config: {
      server: "https://bg.door43.org",
      tokenid: "PlaygroundTesting",
    }
  }

  //Dummy repository
  const repository = {
    name: "",
    owner: {
      username: ""
    }
  }

const Component = () => {

  const [open, setOpen] = useState(false)

  return (

    <>
      <Button onClick={() => setOpen(true)} color="primary" variant="contained">Review</Button>
      <ReviewForm
        open={open}
        onClose={() => setOpen(false)}
        fields={{"Custom field": "default content"}}
        quote={{quote:'Dummy quote', occurrence: 2}}
        repository={repository}
        authentication={authentication}
        preppend={'Dummy Issue'}
      />
    </>
  )
}

<Component/>
```