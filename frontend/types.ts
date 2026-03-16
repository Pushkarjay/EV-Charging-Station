import type { AppProps } from 'next/app';
import type { ReactNode } from 'react';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_API_URL: string;
      readonly NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
      readonly NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?: string;
    }
  }
}

declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export interface Station {
  id: number;
  name: string;
  address: string;
  distance: number;
  chargers: number;
  available: number;
  rating: number;
  price: number;
  type: string;
}

export interface Booking {
  id: number;
  stationId: number;
  userId: number;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}
