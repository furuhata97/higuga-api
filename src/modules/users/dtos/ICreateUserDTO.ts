export default interface ICreateUserDTO {
  name: string;
  email: string;
  zip_code: string;
  city: string;
  address: string;
  phone_number: string;
  is_admin: boolean;
  password: string;
}
