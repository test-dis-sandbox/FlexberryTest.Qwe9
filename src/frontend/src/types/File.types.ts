export interface IBaseFile {
  id: NonEmptyString;
}

export interface IFileL extends IBaseFile {
  name: string;
  storagePath: string;
  version: number;
  createTime: Date | null;
  creator: string;
  editTime: Date | null;
  editor: string;
}

export interface IFileE extends IBaseFile {
  name: string;
  storagePath: string;
  version: number;
}
