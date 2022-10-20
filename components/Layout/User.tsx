import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Skeleton from '@mui/material/Skeleton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';

import { useSession, signIn, signOut } from 'next-auth/react';

export interface UserMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserMenu(props: UserMenuProps) {
  const { user } = props;

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      {!user?.email ? (
        <>
          <IconButton onClick={() => signIn()}>
            <LoginIcon fontSize="inherit" />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton onClick={handleOpenUserMenu}>
            <Avatar
              alt={user?.name || ''}
              src={user?.image || ''}
              sx={{
                width: 24,
                height: 24,
              }}
            >
              <AccountCircleIcon />
            </Avatar>
          </IconButton>

          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem disabled>
              <Typography textAlign="center">{user?.name}</Typography>
            </MenuItem>

            <MenuItem onClick={() => signOut()}>
              <Typography textAlign="center">Sign out</Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
}
