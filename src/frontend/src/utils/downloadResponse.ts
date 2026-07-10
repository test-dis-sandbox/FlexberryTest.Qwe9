export const downloadResponse = (response: Blob, name: string) => {
  const url = URL.createObjectURL(response);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};
