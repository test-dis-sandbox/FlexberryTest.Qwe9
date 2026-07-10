export function getQueryParamStateId(searchParams: URLSearchParams) {
  const stateId = searchParams.get('stateId');
  const queryParam = stateId ? `?stateId=${stateId}` : '';

  return queryParam;
}
