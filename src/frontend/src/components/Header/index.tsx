'use client';

import React from 'react';
import { useCallback } from 'react';
import { Toolbar, Typography, IconButton, Link } from '@mui/material';
import Menu from '@mui/icons-material/Menu';
import Image from 'next/image';

import ColorModeIconDropdown from '@/components/ColorModeIconDropdown';

import { StyledAppBar } from './styles';

interface HeaderProps {
  onNavigationClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigationClick }) => {
  const handleNavigationClick = useCallback(() => {
    onNavigationClick();
  }, [onNavigationClick]);

  return (
    <StyledAppBar
      position="fixed"
      elevation={0}
    >
      <Toolbar>
        <IconButton
          size="large"
          aria-label="menu"
          onClick={handleNavigationClick}
          sx={{ px: 1 }}
        >
          <Menu />
        </IconButton>
        <Link
          href="/"
          sx={{ ml: 2 }}
        >
          <Image
            src="/next.svg"
            alt="Logo"
            width={34}
            height={38}
          />
        </Link>
        <Typography
          variant="h1"
          component="h1"
          sx={{ flexGrow: 1, ml: 1 }}
        >
          Qwe
        </Typography>
        <ColorModeIconDropdown />
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
