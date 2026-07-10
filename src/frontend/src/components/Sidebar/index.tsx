'use client';

import React, { useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';

import { MENU_CONFIG, IMenuItem } from '@/config/menu.config';

import { StyledDrawer } from './styles';

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const router = useRouter();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const handleItemClick = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const toggleItem = useCallback((path: string) => {
    setOpenItems((prev) => ({ ...prev, [path]: !prev[path] }));
  }, []);

  const renderMenuItems = (items: IMenuItem[], level = 0): React.ReactNode => {
    return (
      <>
        {items.map((item) => {
          const hasChildren = !!item.children?.length;
          const isOpen = openItems[item.title];

          const handleClick = () => (hasChildren ? toggleItem(item.title) : handleItemClick(item.path));

          const isActive = !hasChildren && (pathname === item.path || pathname.startsWith(item.path + '/'));

          return (
            <React.Fragment key={item.title}>
              <ListItem
                disablePadding
                sx={level > 0 ? { pl: 2 + level * 2 } : undefined}
              >
                <ListItemButton onClick={handleClick}>
                  <ListItemIcon>
                    <Box
                      sx={(theme) => ({
                        width: 24,
                        height: 24,
                        textAlign: 'center',
                        color: theme.palette.primary.main,
                      })}
                    >
                      {item.icon ? <item.icon /> : '•'}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    slotProps={{
                      primary: {
                        sx: { fontWeight: isActive ? 'bold' : 'normal' },
                      },
                    }}
                  />
                  {hasChildren && <Icon className={isOpen ? 'icon-arrow-down-s' : 'icon-arrow-right-s'} />}
                </ListItemButton>
              </ListItem>

              {hasChildren && (
                <Collapse
                  in={isOpen}
                  timeout="auto"
                  unmountOnExit
                >
                  {renderMenuItems(item.children!, level + 1)}
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <StyledDrawer
      component="nav"
      variant="persistent"
      open={open}
    >
      <List sx={{ flexGrow: 1, pt: '2.5rem' }}>{renderMenuItems(MENU_CONFIG)}</List>
    </StyledDrawer>
  );
};

export default Sidebar;
