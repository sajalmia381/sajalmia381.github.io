export interface IContactPayload {
  fullName: string;
  email: string;
  message: string;
  number: string | undefined;
  subject: string | undefined;
}
