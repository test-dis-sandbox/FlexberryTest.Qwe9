import { useMutation } from '@tanstack/react-query';
import { DataTableFilterMeta, DataTableSortMeta } from 'primereact/datatable';

import { ExportService } from '@/services/Export.service';
import { downloadResponse } from '@/utils/downloadResponse';
import { SearchColumnsParam } from '@/types/helpers/SearchColumnsParam';

interface UseExportListOptions {
  viewName: string;
  fileName: string;
  sorting?: DataTableSortMeta[];
  filter?: DataTableFilterMeta;
  search?: SearchColumnsParam;
}

const useExportList = ({ viewName, fileName, sorting, filter, search }: UseExportListOptions) => {
  const { mutateAsync: exportList, isPending } = useMutation({
    mutationFn: async (visibleFieldNames: string[]) => {
      const response = await ExportService.ExportList(viewName, visibleFieldNames, sorting, filter, search);
      downloadResponse(response.data, `${fileName}.xlsx`);
    },
  });

  return { exportList, isPending };
};

export default useExportList;
