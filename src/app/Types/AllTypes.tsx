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



export type{
    EVENT,
    PaginationProps
}
