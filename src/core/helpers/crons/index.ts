
export interface CronsSchema {
  everyMinute: () => Promise<void>;
  everyHour: () => Promise<void>;
  everyDay: () => Promise<void>;
}


export class CronService implements CronsSchema {
  constructor() {
    //Constructor
  }
  public everyMinute = async(): Promise<void> => {
    //Aqui ejecucion miniute
  };
  public everyHour = async(): Promise<void> => {
    //Aqui ejecucion miniute
  };
  public everyDay = async(): Promise<void> => {
    //Aqui ejecucion miniute
  };
}
