export interface Organiser {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional field
  role: string;
}

export interface Review {
  id: string;
  eventId: string;
  participantId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AppEvent {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  rating: number;
  venue: string;
  category: string;
  capacity: number;
  location: string;
  organizerId: string;
  organiser?: Organiser; // Optional in case it's not always provided
  reviews?: Review[];
  template?: any; // Add this line for the template property (optional)
}
