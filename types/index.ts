export interface ThemeState {
  mode: "light" | "dark";
  color: "blue" | "green" | "purple";
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
  