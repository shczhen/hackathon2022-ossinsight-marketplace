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
}

export default function PanelShareDialog(props: PanelShareDialogProps) {
  const { panelId, parameters } = props;

  const [open, setOpen] = React.useState(false);
  const [host, setHost] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    setHost(window.location.host);
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ShareIcon />}
        onClick={handleClickOpen}
      >
        Share
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Share this panel'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Use this link as iframe src to share this panel with your friends.
          </DialogContentText>
          <Highlighter
            content={'https://' + host + generateShareLink(panelId, parameters)}
          />
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Disagree</Button> */}
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function generateShareLink(
  panelId: string,
  parameters: QueryParameterItemType[]
) {
  const result = `/panels/${panelId}?type=share&`;
  const params = parameters.map((item) => {
    return `${item.name}=<${item.type}>`;
  });
  return result + params.join('&');
}
