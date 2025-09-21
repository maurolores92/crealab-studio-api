export const isNotEmpty = (data: string): boolean =>
  data !== undefined && data.length > 0;

export const spanishToBoolean = (data: string): boolean => {
  return ['si', 'sí'].includes(data?.toLowerCase());
};
