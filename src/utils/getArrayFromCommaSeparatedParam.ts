export function getArrayFromCommaSeparatedParam(paramValue: string): string[] {
  return paramValue ? paramValue.split(",") : [];
}
