import { Response } from "express";
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

class ExcelService {
  private createHeaderMap = (headerMap: any, data: any[]) => {
    return data.map((obj) => {
      const keys = Object.keys(obj);
      const result :any = {};
      keys.forEach((key: string) => result[headerMap[key]] = obj[key]);
      return result;
    });
  }

  public generateAndSave = async (data: any[], name: string, headerMap: any = null, pathRoute = ''): Promise<void> => {
    
    const appRoot: string = (globalThis as any).appRoot;
    if(headerMap) {
      data = this.createHeaderMap(headerMap, data);
    }
  
    const workSheet = XLSX.utils.json_to_sheet(data, {cellStyles: true});
    const workBook = XLSX.utils.book_new();
    
    if (!fs.existsSync(path.join(appRoot, `public/${pathRoute}`))){
      fs.mkdirSync(path.join(appRoot, `public/${pathRoute}`), { recursive: true });
    }
    XLSX.utils.book_append_sheet(workBook, workSheet, "Datos");
    XLSX.writeFile(workBook, path.join(appRoot, 'public', pathRoute, name));
  };
  
  public get = (filename: string, pathRoute = ''): BufferEncoding | string => {
    const appRoot: string = (globalThis as any).appRoot;
    return fs.readFileSync(path.join(appRoot, 'public', pathRoute, filename), 'binary');
  };

  public toResponse = (res: Response, filename: string, pathRoute = ''): void => {
    const appRoot: string = (globalThis as any).appRoot;
    res.setHeader(
      'Content-disposition',
      `attachment; filename="${filename}"`,
    );
    res.setHeader('Content-type', 'application/vnd.ms-excel');
    
    const file = this.get(filename, pathRoute);
    fs.unlinkSync(path.join(appRoot, 'public', pathRoute, filename));
    
    res.setHeader('Content-Length', file.length);
    res.write(file, 'binary');
      
    res.end();
  };
}

export const excelService = new ExcelService();
