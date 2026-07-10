export const FILE_CONFIG = {
  allowedFormats: ['PDF', 'DOC', 'DOCX', 'RTF', 'XLS', 'XLSX', 'JPG', 'PNG', 'ODT', 'PDS', 'PPT', 'PPTX'],
  maxFileSize: 100,
};

export const getFileConfig = () => {
  return {
    allowedFormats: FILE_CONFIG.allowedFormats?.map((f) => (f.startsWith('.') ? f : `.${f}`)),
    maxFileSize: FILE_CONFIG.maxFileSize,
  };
};
