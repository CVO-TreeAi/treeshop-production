import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query all active employees
export const getActiveEmployees = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .order("desc")
      .collect();
  },
});

// Query employees by department
export const getEmployeesByDepartment = query({
  args: { department: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_department", (q) => q.eq("department", args.department))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
  },
});

// Get single employee by ID
export const getEmployee = query({
  args: { id: v.id("employees") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create new employee
export const createEmployee = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    position: v.string(),
    department: v.string(),
    employeeId: v.string(),
    baseHourlyRate: v.number(),
    payType: v.string(),
    salaryAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if employee ID already exists
    const existing = await ctx.db
      .query("employees")
      .withIndex("by_employeeId", (q) => q.eq("employeeId", args.employeeId))
      .first();
    
    if (existing) {
      throw new Error("Employee ID already exists");
    }

    const employeeId = await ctx.db.insert("employees", {
      ...args,
      hireDate: Date.now(),
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return employeeId;
  },
});

// Update employee
export const updateEmployee = mutation({
  args: {
    id: v.id("employees"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    position: v.optional(v.string()),
    department: v.optional(v.string()),
    baseHourlyRate: v.optional(v.number()),
    payType: v.optional(v.string()),
    salaryAmount: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Terminate employee
export const terminateEmployee = mutation({
  args: {
    id: v.id("employees"),
    terminationReason: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "terminated",
      terminationDate: Date.now(),
      terminationReason: args.terminationReason,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Seed sample employees
export const seedEmployees = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleEmployees = [
      {
        firstName: "Mike",
        lastName: "Rodriguez",
        email: "mike@treeai.us",
        phone: "407-555-0101",
        position: "crew_leader",
        department: "field_operations",
        employeeId: "EMP001",
        baseHourlyRate: 28.00,
        payType: "hourly",
        hireDate: Date.now() - (365 * 24 * 60 * 60 * 1000), // 1 year ago
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@treeai.us",
        phone: "407-555-0102",
        position: "operator",
        department: "field_operations",
        employeeId: "EMP002",
        baseHourlyRate: 25.00,
        payType: "hourly",
        hireDate: Date.now() - (180 * 24 * 60 * 60 * 1000), // 6 months ago
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        firstName: "Carlos",
        lastName: "Martinez",
        email: "carlos@treeai.us",
        phone: "407-555-0103",
        position: "laborer",
        department: "field_operations",
        employeeId: "EMP003",
        baseHourlyRate: 18.00,
        payType: "hourly",
        hireDate: Date.now() - (90 * 24 * 60 * 60 * 1000), // 3 months ago
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        firstName: "Jennifer",
        lastName: "Thompson",
        email: "jennifer@treeai.us",
        phone: "407-555-0104",
        position: "admin",
        department: "administration",
        employeeId: "EMP004",
        baseHourlyRate: 22.00,
        payType: "hourly",
        hireDate: Date.now() - (45 * 24 * 60 * 60 * 1000), // 45 days ago
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    ];

    const employeeIds = [];
    for (const employee of sampleEmployees) {
      const id = await ctx.db.insert("employees", employee);
      employeeIds.push(id);
    }

    return { success: true, count: sampleEmployees.length, employeeIds };
  },
});