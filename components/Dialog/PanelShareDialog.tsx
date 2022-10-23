import * as React from 'react';
import Button from '@mui/material/Button';
import ShareIcon from '@mui/icons-material/Share';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Highlighter from 'components/Section/CodeSection';
import { QueryParameterItemType } from 'components/Section/RequestShare';

interface PanelShareDialogProps {
  panelId: string;
  parameters: QueryParameterItemType[];
  type?: 'iframe' | 'svg';
  label?: string;
  title: string;
  description: string;
}

export default function PanelShareDialog(props: PanelShareDialogProps) {
  const {
    panelId,
    parameters,
    type = 'iframe',
    label = 'Share',
    title,
    description,
  } = props;

  const [open, setOpen] = React.useState(false);
  const [host, setHost] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    setHost(window.location.protocol + '//' + window.location.host);
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ShareIcon />}
        onClick={handleClickOpen}
      >
        {label}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
          <Highlighter
            content={host + generateSharePath(type, panelId, parameters)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function generateSharePath(
  type: 'iframe' | 'svg',
  panelId: string,
  parameters: QueryParameterItemType[]
) {
  switch (type) {
    case 'svg':
      return generateSvgPath(panelId, parameters);
    case 'iframe':
    default:
      return generateIframePath(panelId, parameters);
  }
}

function generateIframePath(
  panelId: string,
  parameters: QueryParameterItemType[]
) {
  const result = `/panels/${panelId}?type=share&`;
  const params = parameters.map((item) => {
    return `${item.name}=${item.placeholder}`;
  });
  return result + params.join('&');
}

function generateSvgPath(
  panelId: string,
  parameters: QueryParameterItemType[]
) {
  const result = `/api/panels/svg/${panelId}?`;
  const params = parameters.map((item) => {
    return `${item.name}=${item.placeholder}`;
  });
  return result + params.join('&');
}
