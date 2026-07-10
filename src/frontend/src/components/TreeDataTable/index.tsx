'use client';

import React, { useCallback, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Typography, Box, TextField } from '@mui/material';
import { ChevronRightOutlined, ExpandMoreOutlined, Search as SearchIcon } from '@mui/icons-material';
import {
  TreeTable,
  TreeTableSelectionKeysType,
  TreeTableExpandedKeysType,
  TreeTableTogglerTemplateOptions,
} from 'primereact/treetable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { TreeNode } from 'primereact/treenode';
import { Checkbox } from 'primereact/checkbox';

import ConfirmationDialog from '@/components/ConfirmationDialog';
import {
  DataTablePaginator,
  CurrentPageReportTemplate,
  rowsPerPageOptionsDefault,
} from '@/components/DataTablePaginator';

import TreeDataTableToolbar from './TreeDataTableToolbar';
import { DateCellRenderer } from './DateCellRenderer';

import '@/components/DataTable/style.scss';

export interface FieldDefinition {
  field: string;
  title: string;
  expander?: boolean;
  width?: string;
  filter?: boolean;
}

interface TreeDataTableProps {
  data: TreeNode[];
  fields: FieldDefinition[];
  title?: string;
  subTitle?: string;
  onDelete?: (item: TreeNode[]) => void;
  onRowClick?: (item: TreeNode) => void;
  onCreateButtonClick?: () => void;
  createButtonCaption?: string;
  removeButtonCaption?: string;
  showSelectCountText?: boolean;
  showToggleAll?: boolean;
  showRemoveButton?: boolean;
  showCreateButton?: boolean;
  showSettingsButton?: boolean;
  rowsPerPageOptions?: number[];
  customButtons?: (
    selectedNodes: TreeNode[],
    selectedNodeKeys: TreeTableSelectionKeysType | null,
    setSelectedNodeKeys: React.Dispatch<React.SetStateAction<TreeTableSelectionKeysType | null>>,
    data: TreeNode[]
  ) => React.ReactNode;
  rowClassName?: (data: TreeNode) => object;
  customTogglerTemplate?: (node: TreeNode, options: TreeTableTogglerTemplateOptions) => React.ReactNode;
}

const TreeDataTable = ({
  data,
  fields,
  title,
  onDelete,
  onRowClick,
  onCreateButtonClick,
  subTitle,
  createButtonCaption = 'Создать',
  removeButtonCaption = 'Удалить',
  rowsPerPageOptions = rowsPerPageOptionsDefault,
  showSelectCountText = true,
  showToggleAll = true,
  showRemoveButton = true,
  showCreateButton = true,
  showSettingsButton = true,
  customButtons,
  rowClassName,
  customTogglerTemplate,
}: TreeDataTableProps) => {
  const [open, setOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(fields.map((f) => f.field));

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [expandedKeys, setExpandedKeys] = useState<TreeTableExpandedKeysType | undefined>(undefined);
  const [selectedNodeKeys, setSelectedNodeKeys] = useState<TreeTableSelectionKeysType | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const handleRowClick = useCallback(
    (item: TreeNode) => {
      if (onRowClick) {
        return onRowClick(item);
      }

      if (item && 'id' in item) {
        router.push(`${pathname}/${item.id}`);
      }
    },
    [onRowClick, pathname, router]
  );

  const handleCreateButtonClick = useCallback(() => {
    if (onCreateButtonClick) {
      return onCreateButtonClick();
    }

    router.push(`${pathname}/new`);
  }, [onCreateButtonClick, pathname, router]);

  const handleDeleteButtonClick = () => {
    const selectedNodes = getSelectedNodes();
    if (selectedNodes.length > 0 && onDelete) {
      onDelete(selectedNodes);
      setSelectedNodeKeys(null);
    }
  };

  const getSelectedNodes = () => {
    const selectedNodeObject = selectedNodeKeys || {};
    const checkedNodeKeys = Object.keys(selectedNodeObject).filter((key) => {
      const value = selectedNodeObject[key];

      if (typeof value === 'object' && value !== null && 'checked' in value) {
        return value.checked === true;
      }

      return value === true;
    });

    const selectedNodes: TreeNode[] = [];
    if (checkedNodeKeys) {
      checkedNodeKeys.forEach((key) => {
        const node = findNodeByKey(data, key);
        if (node) {
          selectedNodes.push(node);
        }
      });
    }

    return selectedNodes;
  };

  const findNodeByKey = (nodes: TreeNode[], key: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }

      if (node.children) {
        const foundInChildren = findNodeByKey(node.children, key);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }

    return null;
  };

  const togglerTemplate = (node: TreeNode, options: TreeTableTogglerTemplateOptions) => {
    if (!node) {
      return;
    }

    const expanded = options.expanded;

    return (
      <button
        type="button"
        className="p-treetable-toggler"
        style={options.buttonStyle}
        tabIndex={-1}
        onClick={options.onClick}
      >
        {expanded ? <ExpandMoreOutlined /> : <ChevronRightOutlined />}
      </button>
    );
  };

  const getAllNodeKeys = (nodes: TreeNode[]): Record<string, { checked: boolean; partialChecked: boolean }> => {
    const keys: Record<string, { checked: boolean; partialChecked: boolean }> = {};
    const traverse = (nodeList: TreeNode[]) => {
      nodeList.forEach((node) => {
        if (node.key !== undefined) {
          keys[String(node.key)] = {
            checked: true,
            partialChecked: false,
          };
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);

    return keys;
  };

  const areAllSelected = Object.keys(selectedNodeKeys || {}).length === Object.keys(getAllNodeKeys(data)).length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNodeKeys(getAllNodeKeys(data));
    } else {
      setSelectedNodeKeys({});
    }
  };

  return (
    <>
      <Typography
        variant="h1"
        component="h2"
      >
        {title}
      </Typography>
      <Typography variant="subtitle1">{subTitle}</Typography>

      <TreeDataTableToolbar
        countSelectedRows={Object.keys(selectedNodeKeys || {}).length}
        showSelectCountText={showSelectCountText}
        data={data}
        onCreateButtonClick={handleCreateButtonClick}
        onRemoveButtonClick={() => setOpen(true)}
        onSettingsClick={() => setIsSettingsOpen((prev) => !prev)}
        createButtonCaption={createButtonCaption}
        removeButtonCaption={removeButtonCaption}
        showToggleAll={showToggleAll}
        showRemoveButton={showRemoveButton}
        showCreateButton={showCreateButton}
        showSettingsButton={showSettingsButton}
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
        customButtons={
          customButtons ? customButtons(getSelectedNodes(), selectedNodeKeys, setSelectedNodeKeys, data) : null
        }
      />

      {isSettingsOpen && (
        <Box sx={{ mb: 2, display: 'flex', gap: '1rem' }}>
          <TextField
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Поиск"
            slotProps={{
              input: {
                startAdornment: <SearchIcon />,
                sx: { backgroundColor: '#fff' },
              },
            }}
          />
          <MultiSelect
            value={visibleColumns}
            options={fields.map((col) => ({ label: col.title, value: col.field }))}
            onChange={(e) => setVisibleColumns(e.value)}
            display="chip"
            placeholder="Показать / Скрыть столбцы"
            style={{ maxWidth: '80%', border: 'none', borderRadius: '4px' }}
          />
        </Box>
      )}

      <TreeTable
        value={data}
        globalFilter={globalFilter}
        onRowClick={(e) => {
          const target = e.originalEvent.target as HTMLElement;

          // Клик на чекбокс доплывает досюда.
          if (target.closest('.p-checkbox') || target.closest('.p-treetable-toggler')) {
            return;
          }

          handleRowClick(e.node as TreeNode);
        }}
        resizableColumns
        columnResizeMode="expand"
        sortMode="multiple"
        filterMode="strict"
        selectionMode="checkbox"
        selectionKeys={selectedNodeKeys}
        onSelectionChange={(e) => setSelectedNodeKeys(e.value as TreeTableSelectionKeysType)}
        paginator
        rows={5}
        rowsPerPageOptions={rowsPerPageOptions}
        paginatorLeft={<span>Строк на странице</span>}
        paginatorTemplate={DataTablePaginator(rowsPerPageOptions)}
        currentPageReportTemplate={CurrentPageReportTemplate}
        reorderableColumns
        expandedKeys={expandedKeys}
        onToggle={(e) => setExpandedKeys(e.value)}
        togglerTemplate={customTogglerTemplate || togglerTemplate}
        rowClassName={rowClassName}
      >
        <Column
          selectionMode="multiple"
          style={{ width: '200px' }}
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox
                checked={areAllSelected}
                onChange={(e) => handleSelectAll(!!e.checked)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
              <span>{fields[0].title}</span>
            </div>
          }
          expander={fields[0].expander}
          field={fields[0].field}
          key={fields[0].field}
          sortable
          filter={fields[0].filter ?? false}
          sortField={fields[0].field}
          body={(rowData) => <DateCellRenderer value={rowData.data[fields[0].field]} />}
        />
        {fields
          .slice(1)
          .filter((col) => visibleColumns.includes(col.field))
          .map((col) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.title}
              expander={col.expander}
              sortable
              filter={col.filter ?? false}
              sortField={col.field}
              style={col.width ? { width: col.width } : undefined}
              body={(rowData) => <DateCellRenderer value={rowData.data[col.field]} />}
            />
          ))}
      </TreeTable>
      <ConfirmationDialog
        open={open}
        setOpen={setOpen}
        handleAgree={handleDeleteButtonClick}
        description={`Вы действительно хотите удалить выделенные элементы? Выделено ${getSelectedNodes().length}.`}
      />
    </>
  );
};

export default TreeDataTable;
