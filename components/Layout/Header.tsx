import * as React from 'react';
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
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import UserMenu from 'components/Layout/User';

const ResponsiveAppBar = () => {
  const { data: session } = useSession();

  // const router = useRouter();

  // React.useEffect(() => {
  //   if (session?.user?.email) {
  //     setAuth0Meta(user);
  //   }
  //   if (error) {
  //     setAuth0Meta(null);
  //   }
  // }, [session?.user]);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#f9f9f9',
        boxShadow: 'none',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" aria-label="home icon">
            <Box
              sx={{
                display: 'flex',
                cursor: 'pointer',
              }}
            >
              <Typography variant="h6" color="#172d72">
                OssInsight Marketplace
              </Typography>
            </Box>
          </Link>

          <Box sx={{ flexGrow: 0, ml: 'auto' }}>
            <UserMenu user={session?.user} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
