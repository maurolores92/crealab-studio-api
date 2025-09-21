import ejs from 'ejs';
import path from 'path';

class TemplateHelper {
  public render = async (file: string, data: any): Promise<string> => {
    data.baseUrl = 'https://fullbarcode.com.ar';
    return new Promise((success, reject) => {
      ejs.renderFile(
        path.join(`./templates/mails/${file}.ejs`),
        data,
        (err: any, htmlContent: string) => {
          if (err) {
            reject(err);
          } else {
            success(htmlContent);
          }
        }
      );
    });
  };
}

export const templateHelper = new TemplateHelper();
