/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Base CRUD class with common functionality
export abstract class BaseCrudService<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>
> implements CrudOperations<T, CreateDto, UpdateDto>
{
  protected items: T[];
  protected idField: string;

  constructor(initialItems: T[], idField: string = "id") {
    this.items = [...initialItems];
    this.idField = idField;
  }

  // Simulate API delay
  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Generate unique ID
  protected generateId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Find item by ID
  protected findItemById(id: string): T | undefined {
    return this.items.find((item) => (item as any)[this.idField] === id);
  }

  // Find item index by ID
  protected findItemIndex(id: string): number {
    return this.items.findIndex((item) => (item as any)[this.idField] === id);
  }

  // Abstract methods to be implemented by specific services
  abstract getAll(): Promise<T[]>;
  abstract getById(id: string): Promise<T | null>;
  abstract create(data: CreateDto): Promise<T>;
  abstract update(id: string, data: UpdateDto): Promise<T>;
  abstract delete(id: string): Promise<boolean>;
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
