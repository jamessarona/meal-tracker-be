export interface CurrentUserDTO {
  id: number;
  role: string;
  employee_id: number;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
}