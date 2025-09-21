export interface MailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  body?: any;
  text?: string;
  html?: string;
}
export interface MailResponse {
  status: number;
  success: boolean;
  message: string;
  statusInvoice?: string;
}
