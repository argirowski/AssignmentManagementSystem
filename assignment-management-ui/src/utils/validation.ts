import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(30, "Category name must be less than 30 characters"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const statusSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description must be less than 100 characters"),
});

export type StatusFormData = z.infer<typeof statusSchema>;

export const employeeSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .max(50, "Full Name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(50, "Email must be less than 50 characters"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isCompleted: z.boolean(),
  employeeId: z.string().min(1, "Employee is required"),
  statusId: z.string().min(1, "Status is required"),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
});

export type AssignmentFormData = z.infer<typeof assignmentSchema>;
