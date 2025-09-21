import fs from 'fs';
import path from 'path';

export const uploadFile = async(folder: string, name: string, file: any): Promise<void> => {
  const appRoot: string = (globalThis as any).appRoot;

  if (!fs.existsSync(path.join(appRoot, `public/${folder}`))){
    fs.mkdirSync(path.join(appRoot, `public/${folder}`), { recursive: true });
  }
  file.mv(path.join(appRoot, `public/${folder}`) + '/' + name);
}

export const removeFile = async(file: string) => {
  const appRoot: string = (globalThis as any).appRoot;
 
  if (fs.existsSync(path.join(appRoot, `public/${file}`))) {
    fs.unlinkSync(path.join(appRoot, `public/${file}`));
  }
}