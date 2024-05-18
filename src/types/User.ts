export interface Name {
    title: string;
    first: string;
    last: string;
  }
  
  export interface Location {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: number | string;
  }
  
  export interface Picture {
    large: string;
    medium: string;
    thumbnail: string;
  }
  
  export interface User {
    gender: string;
    name: Name;
    location: Location;
    email: string;
    dob: {
      date: string;
      age: number;
    };
    phone: string;
    picture: Picture;
  }
  