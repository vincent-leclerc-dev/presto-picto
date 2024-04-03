export function wordFromFileName(fileName: string): string[] {
  const cleanUp = fileName
    .replace('.png', '')
    .replace('.jpg', '')
    .replace('.jpeg', '')
    .replaceAll('_', ' ')
    .replace(/[0-9]+/g, '')
    .replace('(', '')
    .replace(')', '')
    .replaceAll(' ', '-')
    .toLocaleLowerCase()
    .trim();
  const words = cleanUp.split('-');
  return words.filter((word) => word !== '');
}

export function uint8arrayToBase64(uint8array: Uint8Array): string {
  return Buffer.from(uint8array).toString('base64');
}
