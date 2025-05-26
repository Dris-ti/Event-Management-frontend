interface EVENT {
  id: string,
  title: string,
  description: string,
  location: string,
  date: string,
  time: string,
  max_seats: number,
  available_seats: number,
  image_url: string,
  tag?: string[],
}

interface  PaginationProps{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface EVENTBooking {
  id: number; // booking id
  event_id: {
    id: number;
    title: string;
    location: string;
    date: string;
    time: string;
    // other fields...
  };
  seats_booked: number;
  booked_at: string;
}




export type{
    EVENT,
    PaginationProps,
    EVENTBooking
}
