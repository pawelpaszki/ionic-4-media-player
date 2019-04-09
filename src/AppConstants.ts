export type DISPLAY_MODES = 'LIST' | 'DETAIL';
export const DISPLAY_MODES = {
  LIST: 'LIST' as DISPLAY_MODES,
  DETAIL: 'DETAIL' as DISPLAY_MODES
};

export type SORT_MODES = 'NO_SORT' | 'NAME_ASCENDING' | 'NAME_DESCENDING' | 'PLAYED_ASCENDING' | 'PLAYED_DESCENDING';
export const SORT_MODES = {
  NO_SORT: 'NO_SORT' as SORT_MODES,
  NAME_ASCENDING: 'NAME_ASCENDING' as SORT_MODES,
  NAME_DESCENDING: 'NAME_DESCENDING' as SORT_MODES,
  PLAYED_ASCENDING: 'PLAYED_ASCENDING' as SORT_MODES,
  PLAYED_DESCENDING: 'PLAYED_DESCENDING' as SORT_MODES
};
