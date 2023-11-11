export type NotifierTemplateType = 'auth-code';

export interface NotifierEmailOptions<T> {
  to: string;
  subject: string;
  text?: string;
  template: NotifierTemplateType;
  context?: T;
}
