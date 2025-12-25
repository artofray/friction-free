export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: string;
  plays: number;
  likes: number;
  dislikes: number; // For community moderation
  isDemonetized: boolean; // Based on vote threshold
  nearTokenId?: string; // Blockchain ID
  royaltyRate: number; // e.g., 0.02 per stream
}

export interface User {
  id: string;
  username: string;
  walletAddress: string | null;
  balance: number; // In NEAR
  isArtist: boolean;
}

export enum ViewState {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD', // Artist Analytics
  STUDIO = 'STUDIO', // Upload & Co-Create
  STREAMING = 'STREAMING', // Listener View
}

export interface AiLyricsResponse {
  lyrics: string;
  suggestedGenre: string;
  mood: string;
}
