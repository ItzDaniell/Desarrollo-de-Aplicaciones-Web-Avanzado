export interface Movie {
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  imdbID: string;
}

export interface MovieDetail {
  Title: string;
  Year: string;
  Genre?: string;
  Plot?: string;
  Poster: string;
  Runtime?: string;
  Director?: string;
  Actors?: string;
  imdbRating?: string;
}
