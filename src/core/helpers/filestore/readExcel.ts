import { read, WorkBook, utils } from 'xlsx';

class ReadExcel {
  public get<T>(data: any,  mapper: Function): T[] {
    
    const binaryData = new Uint8Array(data);
    const arr = new Array();
    for (let i = 0; i != binaryData.length; ++i)
      arr[i] = String.fromCharCode(binaryData[i]);
    const bstr = arr.join('');
    const workbook: WorkBook = read(bstr, { type: 'binary' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const result = utils.sheet_to_json(worksheet, { raw: true });
    return result.map(d => mapper(d));
  }
}

export const readExcel = new ReadExcel();
