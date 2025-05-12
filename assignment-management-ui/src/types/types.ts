export type Employee = {
  id: string;
  fullName: string;
  email: string;
};

export type NewEmployee = Omit<Employee, "id">;

export type EmployeeSelect = Omit<Employee, "email">;

export type Status = {
  id: string;
  description: string;
};

export type StatusFormData = {
  description: string;
};

export type Category = {
  id: string;
  name: string;
};

export type NewCategory = Omit<Category, "id">;

export type Assignment = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  employee: NewEmployee;
  status: StatusFormData;
  categories: NewCategory[];
};

export type CreateAssignment = {
  title: string;
  description: string;
  isCompleted: boolean;
  employeeId: string;
  statusId: string;
  categoryIds: string[];
};

export type ErrorComponentProps = {
  message: string;
};

export type ConfirmCancelModalProps = {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export type ConfirmDeleteModalProps = {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};
