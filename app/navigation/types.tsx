export type SimpleLocation = {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
};

export type RootStackParamList = {
  Login: undefined;
  RegEmailPass: undefined;
  RegLocation: { email: string; password: string };
  RegHeightWeight: {
    email: string;
    password: string;
    location: {
      latitude: number;
      longitude: number;
      city?: string;
      state?: string;
    };
  };
  RegPersonalDetails: {
    email: string;
    password: string;
    height: string;
    weight: string;
    location: {
      latitude: number;
      longitude: number;
      city?: string;
      state?: string;
    };
  };
  RegHobbies: {
    email: string;
    password: string;
    height: string;
    weight: string;
    religion: string;
    smoker: string;
    drinker: string;
    location: {
      latitude: number;
      longitude: number;
      city?: string;
      state?: string;
    };
  };
    RegPreferences: {
    email: string;
    password: string;
    height: string;
    weight: string;
    location: SimpleLocation;
    religion: string;
    smoker: string;
    drinker: string;
    hobbies: string[];
  };
  RegProfile: {
    email: string;
    password: string;
    height: string;
    weight: string;
    religion: string;
    smoker: string;
    drinker: string;
    hobbies: string[];
    location: {
      latitude: number;
      longitude: number;
      city?: string;
      state?: string;
    };
    preferences: {
    maxDistance: number;
    religionImportant: boolean;
    preferredReligion: string | null;
    allowsSmoking: boolean;
    allowsDrinking: boolean;
  };
  };
  Inside: undefined;
};

export type InsideStackParamList = {
  CNCT: undefined;
  details: undefined;
  ChatList: undefined;
  ChatScreen: { chatId: string | null; userId: string };
};
