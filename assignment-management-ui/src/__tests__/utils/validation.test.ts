import {
  categorySchema,
  statusSchema,
  employeeSchema,
  assignmentSchema,
} from "../../utils/validation";

describe("categorySchema", () => {
  it("accepts valid category", () => {
    expect(categorySchema.safeParse({ name: "Test" }).success).toBe(true);
  });
  it("rejects empty name", () => {
    const result = categorySchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/required/i);
  });
  it("rejects long name", () => {
    const result = categorySchema.safeParse({ name: "a".repeat(31) });
    expect(result.success).toBe(false);
    expect(result.error && result.error.issues[0].message).toMatch(
      /less than 30/i
    );
  });
});

describe("statusSchema", () => {
  it("accepts valid status", () => {
    expect(statusSchema.safeParse({ description: "Test status" }).success).toBe(
      true
    );
  });
  it("rejects empty description", () => {
    const result = statusSchema.safeParse({ description: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/required/i);
  });
  it("rejects long description", () => {
    const result = statusSchema.safeParse({ description: "a".repeat(101) });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/less than 100/i);
  });
});

describe("employeeSchema", () => {
  it("accepts valid employee", () => {
    expect(
      employeeSchema.safeParse({
        fullName: "John Doe",
        email: "john@example.com",
      }).success
    ).toBe(true);
  });
  it("rejects empty fullName", () => {
    const result = employeeSchema.safeParse({
      fullName: "",
      email: "john@example.com",
    });
    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => /Full Name is required/i.test(i.message))
    ).toBe(true);
  });
  it("rejects invalid email", () => {
    const result = employeeSchema.safeParse({
      fullName: "John Doe",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => /Invalid email/i.test(i.message))
    ).toBe(true);
  });
});

describe("assignmentSchema", () => {
  const valid = {
    title: "Assignment 1",
    description: "Description",
    isCompleted: false,
    employeeId: "emp1",
    statusId: "stat1",
    categoryIds: ["cat1"],
  };
  it("accepts valid assignment", () => {
    expect(assignmentSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects missing title", () => {
    const { title, ...rest } = valid;
    const result = assignmentSchema.safeParse({ ...rest });
    expect(result.success).toBe(false);
    // Log the actual error messages for debugging if needed
    // console.log(result.error?.issues.map(i => i.message));
    expect(
      result.error?.issues.some(
        (i) => /required/i.test(i.message) || /title/i.test(i.message)
      )
    ).toBe(true);
  });
  it("rejects empty categoryIds", () => {
    const result = assignmentSchema.safeParse({ ...valid, categoryIds: [] });
    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => /At least one category/i.test(i.message))
    ).toBe(true);
  });
});
