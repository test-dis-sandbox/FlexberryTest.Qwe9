export interface GetRequestOptions {
  id: NonEmptyString;
  viewName: string;
  enabled?: boolean;
  onNotFound?: () => void;
}
