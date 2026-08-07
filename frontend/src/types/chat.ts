export interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  loading?: boolean;

  // New
  animated?: boolean;
}