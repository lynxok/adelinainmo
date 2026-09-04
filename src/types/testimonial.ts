export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  quote: string;
  rating: number;
  date: string;
  avatar_url?: string;
  is_active: boolean;
  order_index?: number;
  created_at?: string;
}

