export enum WebsocketOptions {
  notifications,
}

export const getWsOptions = (): string[] => {
  const options: string[] = [];
  for(const value in WebsocketOptions) {
    const isValueProperty = Number(value) >= 0;
    if(isValueProperty) {
      options.push(WebsocketOptions[value]);
    }
  }
  return options;
};