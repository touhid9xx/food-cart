/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "../../types";

// Generic CRUD Types
export interface CrudOperations<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>
> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<boolean>;
  search?(criteria: any): Promise<T[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterCriteria {
  [key: string]: any;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

// Generic repository with advanced operations
export class GenericRepository<T extends { id: string }> {
  private items: T[];

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  // Basic CRUD operations
  async getAll(): Promise<T[]> {
    await this.delay(300);
    return [...this.items];
  }

  async getById(id: string): Promise<T | null> {
    await this.delay(200);
    return this.items.find((item) => item.id === id) || null;
  }

  async create(data: Omit<T, "id">): Promise<T> {
    await this.delay(400);
    const newItem = {
      ...data,
      id: this.generateId(),
    } as T;
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await this.delay(400);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    this.items[index] = { ...this.items[index], ...data };
    return this.items[index];
  }

  async delete(id: string): Promise<boolean> {
    await this.delay(300);
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    return this.items.length < initialLength;
  }

  // Advanced operations
  async search(criteria: FilterCriteria): Promise<T[]> {
    await this.delay(500);
    return this.items.filter((item) => {
      return Object.entries(criteria).every(([key, value]) => {
        const itemValue = (item as any)[key];
        if (typeof value === "string" && typeof itemValue === "string") {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        return itemValue === value;
      });
    });
  }

  async paginate(
    page: number = 1,
    limit: number = 10,
    sort?: SortOptions
  ): Promise<PaginatedResponse<T>> {
    await this.delay(400);

    let sortedItems = [...this.items];

    // Apply sorting if provided
    if (sort) {
      sortedItems.sort((a, b) => {
        const aValue = (a as any)[sort.field];
        const bValue = (b as any)[sort.field];

        if (sort.direction === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = sortedItems.slice(startIndex, endIndex);

    return {
      data: paginatedItems,
      total: this.items.length,
      page,
      limit,
      totalPages: Math.ceil(this.items.length / limit),
    };
  }

  async getByField(field: string, value: any): Promise<T[]> {
    await this.delay(300);
    return this.items.filter((item) => (item as any)[field] === value);
  }

  async exists(id: string): Promise<boolean> {
    await this.delay(100);
    return this.items.some((item) => item.id === id);
  }

  async count(): Promise<number> {
    await this.delay(200);
    return this.items.length;
  }

  async bulkCreate(items: Omit<T, "id">[]): Promise<T[]> {
    await this.delay(600);
    const newItems = items.map((item) => ({
      ...item,
      id: this.generateId(),
    })) as T[];
    this.items.push(...newItems);
    return newItems;
  }

  async bulkDelete(ids: string[]): Promise<number> {
    await this.delay(500);
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => !ids.includes(item.id));
    return initialLength - this.items.length;
  }

  // Private methods
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class ApiResponseBuilder {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  static error<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: false,
      data: data as T,
      message,
    };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string
  ): ApiResponse<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return {
      success: true,
      data: {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message,
    };
  }
}

// Generic CRUD service with API responses
export class CrudService<T extends { id: string }> {
  protected repository: GenericRepository<T>;

  constructor(initialItems: T[] = []) {
    this.repository = new GenericRepository<T>(initialItems);
  }

  async getAll(message?: string): Promise<ApiResponse<T[]>> {
    try {
      const data = await this.repository.getAll();
      return ApiResponseBuilder.success(
        data,
        message || "Items retrieved successfully"
      );
    } catch (error) {
      return ApiResponseBuilder.error("Failed to retrieve items", [] as T[]);
    }
  }

  async getById(id: string, message?: string): Promise<ApiResponse<T | null>> {
    try {
      const data = await this.repository.getById(id);
      return ApiResponseBuilder.success(
        data,
        message || "Item retrieved successfully"
      );
    } catch (error) {
      return ApiResponseBuilder.error("Item not found", null);
    }
  }

  async create(data: Omit<T, "id">, message?: string): Promise<ApiResponse<T>> {
    try {
      const newItem = await this.repository.create(data);
      return ApiResponseBuilder.success(
        newItem,
        message || "Item created successfully"
      );
    } catch (error) {
      return ApiResponseBuilder.error("Failed to create item", {} as T);
    }
  }

  async update(
    id: string,
    data: Partial<T>,
    message?: string
  ): Promise<ApiResponse<T>> {
    try {
      const updatedItem = await this.repository.update(id, data);
      return ApiResponseBuilder.success(
        updatedItem,
        message || "Item updated successfully"
      );
    } catch (error) {
      return ApiResponseBuilder.error("Failed to update item", {} as T);
    }
  }

  async delete(id: string, message?: string): Promise<ApiResponse<boolean>> {
    try {
      const success = await this.repository.delete(id);
      return ApiResponseBuilder.success(
        success,
        message || "Item deleted successfully"
      );
    } catch (error) {
      return ApiResponseBuilder.error("Failed to delete item", false);
    }
  }

  async search(criteria: any, message?: string): Promise<ApiResponse<T[]>> {
    try {
      const data = await this.repository.search(criteria);
      return ApiResponseBuilder.success(
        data,
        message || "Search completed successfully"
      );
    } catch (error) {
      return ApiResponseBuilder.error("Search failed", []);
    }
  }

  async paginate(
    page: number = 1,
    limit: number = 10,
    sort?: { field: string; direction: "asc" | "desc" },
    message?: string
  ): Promise<
    ApiResponse<{
      data: T[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    try {
      const result = await this.repository.paginate(page, limit, sort);
      return ApiResponseBuilder.paginated(
        result.data,
        result.total,
        result.page,
        result.limit,
        message || "Paginated data retrieved successfully"
      );
    } catch (error) {
      return ApiResponseBuilder.error("Pagination failed", {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      });
    }
  }

  // Additional methods
  async getByField(
    field: string,
    value: any,
    message?: string
  ): Promise<ApiResponse<T[]>> {
    try {
      const data = await this.repository.getByField(field, value);
      return ApiResponseBuilder.success(
        data,
        message || "Items retrieved by field successfully"
      );
    } catch (error) {
      return ApiResponseBuilder.error("Failed to retrieve items by field", []);
    }
  }

  async exists(id: string): Promise<ApiResponse<boolean>> {
    try {
      const exists = await this.repository.exists(id);
      return ApiResponseBuilder.success(
        exists,
        exists ? "Item exists" : "Item does not exist"
      );
    } catch (error) {
      return ApiResponseBuilder.error("Check existence failed", false);
    }
  }

  async count(message?: string): Promise<ApiResponse<number>> {
    try {
      const count = await this.repository.count();
      return ApiResponseBuilder.success(
        count,
        message || "Count retrieved successfully"
      );
    } catch (error) {
      return ApiResponseBuilder.error("Failed to get count", 0);
    }
  }
}
