import * as React from 'react';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import ShareIcon from '@mui/icons-material/Share';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PublishIcon from '@mui/icons-material/Publish';
import TextField from '@mui/material/TextField';

import _ from 'lodash';
import axios from 'lib/axios';

const DEFAULT_PANEL_JSON = {
  title: '',
  name: '',
  topic: [],
  description: '',
  query: {
    definition: './query.json',
    template: './template.sql',
    ignoreCache: true,
  },
  render: {
    cache: {
      ttl: 3600,
    },
    src: './render.js',
  },
  author: [],
  shared: true,
};

const DEFAULT_QUERY_JSON = {
  name: 'Repository Star History',
  description: '',
  public: true,
  cache: {
    ttl: 3600,
  },
  parameters: [],
  results: {
    type: 'object',
    properties: {
      event_month: {
        type: 'string',
        description: 'Event month',
      },
      repo_id: {
        type: 'number',
        description: 'GitHub Repo ID',
      },
      total: {
        type: 'number',
        description: 'Total stars in the month',
      },
    },
    required: ['event_month', 'repo_id', 'total'],
  },
};

interface SubmitPanelDialogProps {
  sql: string;
  js: string;
  disabled?: boolean;
}

export default function SubmitPanelDialog(props: SubmitPanelDialogProps) {
  const { sql, js, disabled } = props;
  const [open, setOpen] = React.useState(false);

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [paramStr, setParamStr] = React.useState('');

  const [isNameValid, setIsNameValid] = React.useState(false);
  const [isParamStrValid, setIsParamStrValid] = React.useState(false);

  const [error, setError] = React.useState<any>(null);

  React.useEffect(() => {
    const nameTest = name.trim().replaceAll(/\w/g, '').replaceAll(/\-/g, '');
    if (nameTest === '') {
      setIsNameValid(true);
    } else {
      setIsNameValid(false);
    }
    try {
      JSON.parse(paramStr);
      setIsParamStrValid(true);
    } catch (e) {
      if (paramStr === '') {
        setIsParamStrValid(true);
      } else {
        setIsParamStrValid(false);
      }
    }
  }, [name, paramStr]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    const panelClone = _.cloneDeep(DEFAULT_PANEL_JSON);
    const queryClone = _.cloneDeep(DEFAULT_QUERY_JSON);
    panelClone.title = title;
    panelClone.name = name;
    panelClone.description = description;
    queryClone.name = title;
    queryClone.description = description;
    queryClone.parameters = JSON.parse(paramStr);

    try {
      await axios
        .post('/api/panels/request', {
          panel: panelClone,
          query: queryClone,
          script: js,
          sql,
        })
        .then((res) => res.data);
      handleClose();
    } catch (error: any) {
      setError(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<PublishIcon />}
        onClick={handleClickOpen}
        disabled={disabled}
        sx={{
          margin: '2rem 0',
        }}
      >
        Submit
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Submit this panel'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            To submit this panel, please enter some details here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Panel Name (*required)"
            type="string"
            fullWidth
            variant="standard"
            helperText="Also be konwn as ID. Only allow [a-zA-Z0-9_]"
            onChange={(e) => setName(e.target.value)}
            error={!isNameValid}
          />
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Panel Title"
            type="string"
            fullWidth
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="desc"
            label="Panel Description"
            type="string"
            fullWidth
            variant="standard"
            multiline
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="param"
            label="Query Parameters"
            type="string"
            fullWidth
            variant="standard"
            helperText="Define query parameters in JSON format."
            multiline
            rows={6}
            onChange={(e) => setParamStr(e.target.value)}
            error={!isParamStrValid}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            onClick={handleSubmit}
            autoFocus
            disabled={!isNameValid || !isParamStrValid || name === ''}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
