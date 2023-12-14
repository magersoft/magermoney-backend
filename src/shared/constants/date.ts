export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth();
export const CURRENT_DAY = new Date().getDate();

export const BEGIN_MONTH = new Date(CURRENT_YEAR, CURRENT_MONTH, 1);
export const END_MONTH = new Date(CURRENT_YEAR, CURRENT_MONTH + 1, 0);
