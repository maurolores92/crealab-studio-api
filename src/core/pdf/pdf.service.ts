import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';
import { env } from '../configurations';
import { Response } from 'express';

class PdfService {

  public generate = async (html: string): Promise<any> => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox',],
      protocolTimeout: 240000,
    });
    const page = await browser.newPage();
    await page.emulateMediaType('print');
    await page.setContent(html);
    const pdf = await page.pdf({ 
      format: 'A4',
      margin: { top: 30, bottom: 30,},
     });
    await browser.close();

    return Buffer.from(Object.values(pdf));
  };

  public generateAndSave = async (html: string,  name: string, pathRoute = ''): Promise<void> => {
    const pdf = await this.generate(html);
    const appRoot: string = (globalThis as any).appRoot;
    fs.writeFileSync(path.join(appRoot, 'public', pathRoute, name), pdf);
  };

  public getHtmlFromTemplate = async(file: string, data: any): Promise<string> => {
    const appRoot: string = (globalThis as any).appRoot;
    
    return new Promise((success, error) => {
      ejs.renderFile(
        path.join(appRoot, `templates/pdf/${file}.ejs`),
        data,
        (err: any, htmlContent: string) => {
          if (err) {
            error(err);
          } else {
            success(htmlContent);
          }
        },
      );
    });
  };
  
  public get = (filename: string, pathRoute = ''): BufferEncoding | string => {
    const appRoot: string = (globalThis as any).appRoot;
    return fs.readFileSync(path.join(appRoot, 'public', pathRoute, filename), 'binary');
  };

  public toResponse = (res: Response, filename: string, pathRoute = ''): void => {
    res.setHeader(
      'Content-disposition',
      `attachment; filename="${filename}"`,
    );
    
    const file = pdfService.get(filename, pathRoute);
    res.setHeader('Content-Length', file.length);
    res.write(file, 'binary');

    res.end();
  };
}

export const pdfService = new PdfService();