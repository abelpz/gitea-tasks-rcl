import PropTypes from "prop-types"
import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	Portal,
	Snackbar,
	TextField,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useCallback, useEffect, useState } from 'react';

import useRepoIssues from '../../hooks/useRepoIssues';

export default function ReviewForm({
  fields,
  repository,
  quote,
  open,
  onClose,
  authentication,
  preppend,
}) {
  const [openSnack, setOpenSnack] = useState(false)
  const [alert, setAlert] = useState(null)
  const [formData, setFormData] = useState(null)
  const { setIssue, isLoading } = useRepoIssues({ authentication })
  useEffect(() => {
    setFormData({
      ...fields,
      ...quote,
      title: '',
      comment: '',
    })
  }, [fields, quote])
  const sendIssue = useCallback(async () => {
    if (formData.title !== '') {
      const link = formData.quote && formData.link
      const metaData = !link
        ? { ...formData }
        : {
            ...formData,
            link: encodeURI(
              link +
                (link?.includes('?') ? '&' : '?') +
                `check=${formData.quote}&hint=${formData.title}`
            ),
          }
      const body = Object.keys(metaData).reduce((prev, current) => {
        if (current === 'title') return prev
        const title = current.charAt(0).toUpperCase() + current.slice(1)
        return prev + `**${title}:**\n${metaData[current]}\n`
      }, `### ${metaData.title}\n\n`)

      const newIssue = await setIssue({
        title: metaData.title,
        owner: repository?.owner.username,
        repo: repository?.name,
        body,
      })
      if (newIssue.id) {
        onClose()
        setAlert({
          message: (
            <>
              {`Report created successfully\n`}
              <Button
                size='small'
                color='primary'
                href={newIssue['html_url']}
                target='_blank'
              >
                {'Open report'}
              </Button>
            </>
          ),
          severity: 'success',
        })
        setOpenSnack(true)
      } else {
        setAlert({
          message: 'Error creating report',
          severity: 'error',
        })
        setOpenSnack(true)
      }
    }
  }, [formData, onClose, repository.name, repository.owner.username, setIssue])

  const handleCloseSnack = () => setOpenSnack(false)

  //TODO: SEPARATE DIALOGUE FROM CONTENT

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the form to give details about this report.
          </DialogContentText>
          <Grid container spacing='2'>
            {Object.keys(fields).map((fieldKey, index) => {
              return (
                <Grid item xs={12} sm={6} key={index}>
                  <TextField
                    md={5}
                    key={index}
                    value={fields[fieldKey]}
                    margin='dense'
                    id={fieldKey}
                    label={fieldKey}
                    type='text'
                    fullWidth
                    variant='standard'
                    onChange={e => {
                      setFormData({ ...formData, [fieldKey]: e.target.value })
                    }}
                  />
                </Grid>
              )
            })}
          </Grid>
          <TextField
            margin='dense'
            label={'Quote'}
            value={quote?.quote}
            type='text'
            fullWidth
            variant='standard'
            onChange={e => {
              setFormData({ ...formData, quote: e.target.value })
            }}
          />
          <TextField
            margin='dense'
            label={'Occurrence'}
            value={quote?.occurrence}
            type='text'
            fullWidth
            variant='standard'
            onChange={e => {
              setFormData({ ...formData, occurrence: e.target.value })
            }}
          />
          <TextField
            autoFocus
            margin='dense'
            label={'Title'}
            type='text'
            fullWidth
            variant='standard'
            onChange={e => {
              setFormData({
                ...formData,
                title:
                  preppend !== ''
                    ? `${preppend} | ${e.target.value}`
                    : e.target.value,
              })
            }}
          />
          <TextField
            multiline
            rows={4}
            margin='dense'
            label={'Comment'}
            type='text'
            fullWidth
            variant='standard'
            onChange={e => {
              setFormData({ ...formData, comment: e.target.value })
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={sendIssue} disabled={isLoading} color={'primary'}>
            {isLoading ? (
              <>
                <CircularProgress size='1rem' sx={{ mr: '0.5rem' }} />{' '}
                {'Loading...'}
              </>
            ) : (
              'Send'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {alert && openSnack && (
        <Portal>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={openSnack}
            autoHideDuration={6000}
            onClose={handleCloseSnack}
          >
            <Alert onClose={handleCloseSnack} severity={alert.severity}>
              {alert.message}
            </Alert>
          </Snackbar>
        </Portal>
      )}
    </>
  )
}

ReviewForm.propTypes = {
	authentication: PropTypes.any,
	fields: PropTypes.any,
	onClose: PropTypes.func,
	open: PropTypes.any,
	preppend: PropTypes.string,
	quote: PropTypes.shape({
		occurrence: PropTypes.any,
		quote: PropTypes.any
	}),
	repository: PropTypes.shape({
		name: PropTypes.any,
		owner: PropTypes.shape({
			username: PropTypes.any
		})
	})
}
