export type TableSchema = Hotel | Personel | Job | Room | Visitor | Reservation | AvailableRoom | VisitorDetails | HotelOccupancy;

export type Hotel = {
  id: number;
  name: string;
  inn: number;
  director_inn: number;
  owner_inn: number;
  address: string;
}

export type Personel = {
  inn: number;
  full_name: string;
  job_id: number;
  hotel_id: number;
}

export type Job = {
  id: number;
  name: string;
}

export type Room = {
  number: number;
  description: string;
  spaces: number;
  price_per_day: number;
  status: 'repairs' | 'working';
}

export type Visitor = {
  id: number;
  room_number: number;
  check_in_date: Date;
  departure_date: Date;
  prepayment: number;
  visitor_description: string;
}

export type Reservation = {
  id: number;
  visitor_id: number;
  room_number: number;
  check_in_date: Date;
}

export type AvailableRoom = {
  number: number;
  description: string;
  spaces: number;
  price_per_day: number;
}

export type VisitorDetails = {
  id: number;
  room_number: number;
  check_in_date: Date;
  departure_date: Date;
  prepayment: number;
  visitor_description: string;
  room_description: string;
  spaces: number;
  price_per_day: number;
}

export type HotelOccupancy = {
  hotel_name: string;
  visitor_count: number;
}
