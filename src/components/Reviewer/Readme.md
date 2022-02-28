The Reviewer component adds the review function to any referenced component, allowing the user to select the text to be reviewed and send a review request for the selected text.

### Simple implementation

The Reviewer component requires the 'authentication' and 'repository' props in order to send a review request. The following example wont send any review request.

**Example:**

> **Tip:** Highlight text to tigger.

```js
  import {useState, useCallback} from 'react';
  import { Paper, Typography } from '@material-ui/core';

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
    
  const [target, setTarget] = useState(null);
  const getRef = useCallback((node) => {
    setTarget(node);
  }, []);

    return (
      <Paper style={{padding:'2rem'}}>
        <Typography ref={getRef} gutterBottom>
          Occaecat eiusmod amet dolor ipsum excepteur. Pariatur minim ex veniam minim excepteur duis irure amet enim sit elit. Elit aute cupidatat cupidatat aute elit pariatur et aliqua incididunt sit pariatur.
        </Typography>
        <Reviewer
          preppend={'Example'}
          repository={repository}
          target={target}
          authentication={authentication}
        />
      </Paper>
    )
  }

  <Component/>
```

### Combining with gitea-react-toolkit and translation-helps-rcl

Use the Reviewer component to create issues for specific resources with the help of translation-helps-rcl Cards.

**Example:**

```js
import React, { useContext, useState, useCallback } from 'react';
import { Card, CardContent } from 'translation-helps-rcl/dist/components';
import { useCardState, useContent } from 'translation-helps-rcl/dist/hooks';
import { AuthenticationContext, AuthenticationContextProvider } from 'gitea-react-toolkit';

const config = {
  server: 'https://bg.door43.org',
  tokenid: 'gitea-task-rcl',
};

const resource = {
  id: 'tn',
  languageId: 'en',
  owner: 'test_org',
};

const reference = {
  projectId: 'tit',
  chapter: 1,
  verse: 2,
};

const Component = () => {

  const { state: authentication, actions, component } = useContext(AuthenticationContext);
  const [selectedQuote, setQuote] = useState({});
  const [cardRef, setCardRef] = useState(null);
  const getRef = useCallback((node) => {
    setCardRef(node);
  }, []);

  const { markdown, items, isLoading } = useContent({
    chapter: reference.chapter,
    verse: reference.verse,
    languageId: resource.languageId,
    projectId: reference.projectId,
    ref: 'master',
    resourceId: resource.id,
    owner: resource.owner,
    server: config.server,
  })

  const {
    state: { item, headers, filters, fontSize, itemIndex, markdownView },
    actions: { setFilters, setFontSize, setItemIndex, setMarkdownView },
  } = useCardState({
    items,
  });

  const reviewExtraFields = {
    book: reference.projectId,
    verse: reference.verse,
    chapter: reference.chapter,
    id: item ? item.ID : null,
    link: `https://create.translationcore.com`,
  };

  const showSaveChangesPrompt = () => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  return !authentication ? component :
  <>
    <Card
      dragRef={getRef}
      items={items}
      title={`${resource.id} content card`}
      headers={headers}
      filters={filters}
      fontSize={fontSize}
      itemIndex={itemIndex}
      setFilters={setFilters}
      setFontSize={setFontSize}
      setItemIndex={setItemIndex}
      markdownView={markdownView}
      setMarkdownView={setMarkdownView}
      showSaveChangesPrompt={showSaveChangesPrompt}
    >
      <CardContent
        item={item}
        filters={filters}
        fontSize={fontSize}
        markdown={markdown}
        isLoading={isLoading}
        languageId={resource.languageId}
        markdownView={markdownView}
        selectedQuote={selectedQuote}
        setQuote={setQuote}
        showSaveChangesPrompt={showSaveChangesPrompt}
      />
    </Card>
    <Reviewer
      preppend={config.tokenid}
      fields={reviewExtraFields}
      repository={{
        name: `${resource.languageId}_${resource.id}`,
        owner: {username: resource.owner}
      }}
      target={cardRef}
      authentication={authentication}
    />
  </>

};

const [authentication, setAuthentication] = useState();

<AuthenticationContextProvider
  config={config}
  authentication={authentication}
  onAuthentication={setAuthentication}
>
  <Component />
</AuthenticationContextProvider>

```
