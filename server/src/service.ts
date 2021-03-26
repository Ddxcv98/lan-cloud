import fs from 'fs';

import { fileSize } from './util';

export async function readFiles() {
  const files = [];
  const dir = await fs.promises.readdir(`${__dirname}/../files`);

  for (const content of dir) {
    const stat = await fs.promises.stat(`${__dirname}/../files/${content}`);

    if (stat.isFile()) {
      files.push({
        name: content,
        size: fileSize(stat.size)
      });
    }
  }

  return files;
}
