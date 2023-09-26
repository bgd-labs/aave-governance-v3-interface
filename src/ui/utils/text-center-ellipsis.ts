// eslint-disable-next-line import/prefer-default-export
export function textCenterEllipsis(str: string, from: number, to: number) {
  return `${(str || '').substr(0, from)}...${(str || '').substr(
    (str || '').length - to,
    (str || '').length,
  )}`;
}
