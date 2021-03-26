const symbols = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

export function fileSize(bytes: number) {
  if (!Number.isSafeInteger(bytes)) return 'Big AF';
  let index = 0;

  while (bytes >= 1024) {
    bytes /= 1024;
    index++;
  }

  return `${index == 0 ? bytes : bytes.toFixed(1)} ${symbols[index]}`;
}
