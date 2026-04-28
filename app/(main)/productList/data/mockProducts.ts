export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  user: string;
  userImage: string;
  location: string;
  storeName: string;
  category: string;
  description: string;
  who_reported:string;
  reportStatus:string;
  reportReason:string;
};

export type FilterOptions = {
  brands: string[];
  colors: { label: string; hex: string }[];
  priceRanges: { label: string; min: number; max: number }[];
};

export const FILTER_OPTIONS = {
  categories: [
    "school_supplies",
    "food",
    "beverages",
    'printing_services',
    'school_uniform',
    'personal_care'
  ],
  priceRanges: [
    { label: "0-100", min: 0, max: 100 },
    { label: "100-200", min: 100, max: 200 },
    { label: "200-500", min: 200, max: 500 },
  ],
};

