export type Employee = {
  id: number;
  fullName: string;
  email: string;
};

export type NewEmployee = Omit<Employee, "id">;

export type EmployeeSelect = Omit<Employee, "email">;

export type Status = {
  id: number;
  description: string;
};

export type StatusFormData = {
  description: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Assignment = {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  employee: Employee;
  status: Status;
  categories: Category[];
};

export type CreateAssignment = {
  title: string;
  description: string;
  isCompleted: boolean;
  employeeId: string;
  statusId: string;
  categoryIds: string[];
};
