import * as React from 'react';
import { Button, Divider, Icon, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { TreeTableExpandedKeysType } from 'primereact/treetable';
import { TreeNode } from 'primereact/treenode';
import { Add, Remove, SettingsOutlined, DescriptionOutlined } from '@mui/icons-material';

interface TreeDataTableToolbarProps {
  countSelectedRows: number;
  showSelectCountText?: boolean;
  data: TreeNode[];
  createButtonCaption?: string;
  removeButtonCaption?: string;
  onCreateButtonClick: () => void;
  onRemoveButtonClick: () => void;
  onSettingsClick?: () => void;
  showToggleAll?: boolean;
  showExportButton?: boolean;
  showRemoveButton?: boolean;
  showCreateButton?: boolean;
  showSettingsButton?: boolean;
  expandedKeys: TreeTableExpandedKeysType | undefined;
  setExpandedKeys: (setExpandedKey: TreeTableExpandedKeysType | undefined) => void;
  customButtons?: React.ReactNode;
}

const TreeDataTableToolbar: React.FC<TreeDataTableToolbarProps> = ({
  countSelectedRows,
  showSelectCountText = true,
  data,
  createButtonCaption = 'Создать',
  removeButtonCaption = 'Удалить',
  onCreateButtonClick,
  onRemoveButtonClick,
  onSettingsClick,
  showToggleAll = true,
  showRemoveButton = true,
  showCreateButton = true,
  showSettingsButton = true,
  expandedKeys,
  setExpandedKeys,
  customButtons,
}) => {
  const showToolBarDivider = showSettingsButton && (showRemoveButton || showCreateButton);

  const getAllKeys = (nodes: TreeNode[]) => {
    const keys: Record<string, boolean> = {};
    const processNode = (node: TreeNode) => {
      if (node.key !== undefined) {
        keys[node.key] = true;
      }

      if (node.children) {
        node.children.forEach((child) => processNode(child));
      }
    };
    nodes.forEach((node) => processNode(node));

    return keys;
  };

  const expandAll = () => {
    const keys = getAllKeys(data);
    setExpandedKeys(keys);
  };

  const collapseAll = () => {
    setExpandedKeys({});
  };

  const toggleAll = () => {
    if (!expandedKeys || Object.keys(expandedKeys).length === 0) {
      expandAll();
    } else {
      collapseAll();
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      flexWrap="wrap"
      mb={2.5}
    >
      {showSelectCountText && (
        <Typography
          variant="subtitle1"
          sx={{ flexGrow: 1 }}
        >
          {countSelectedRows} объекта(ов) выбрано
        </Typography>
      )}
      <Stack
        spacing={2}
        direction="row"
      >
        {showToggleAll && (
          <Tooltip title="Свернуть/развернуть все вершины">
            <Button
              variant="contained"
              startIcon={<DescriptionOutlined />}
              onClick={toggleAll}
            >
              Свернуть/развернуть все
            </Button>
          </Tooltip>
        )}
        {showCreateButton && (
          <Tooltip title="Создать запись">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onCreateButtonClick}
            >
              {createButtonCaption}
            </Button>
          </Tooltip>
        )}
        {showRemoveButton && (
          <Tooltip title={countSelectedRows === 0 ? 'Выберите строку(-ки) для удаления' : 'Удалить выделенные записи'}>
            <span>
              <Button
                variant="contained"
                startIcon={<Remove />}
                disabled={countSelectedRows === 0}
                onClick={onRemoveButtonClick}
              >
                {removeButtonCaption}
              </Button>
            </span>
          </Tooltip>
        )}
        {showSettingsButton && (
          <>
            {showToolBarDivider && (
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
              />
            )}
            <Tooltip title="Настройки">
              <IconButton
                color="primary"
                aria-label="settings"
                onClick={onSettingsClick}
              >
                <SettingsOutlined />
              </IconButton>
            </Tooltip>
          </>
        )}
        {customButtons && customButtons}
      </Stack>
    </Stack>
  );
};

export default TreeDataTableToolbar;
