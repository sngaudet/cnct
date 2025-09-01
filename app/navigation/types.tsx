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

RegGender: {
  email: string;
  password: string;
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
  };
};

RegPhotos: {
  email: string;
  password: string;
  location: { latitude: number; longitude: number; city?: string; state?: string };
  gender: string;
  seeking: string[];
};

  RegHeightWeight: {
    email: string;
    password: string;
    location: {
      latitude: number;
      longitude: number;
      city?: string;
      state?: string;
    };
      gender: string;
  seeking: string[];
    photos: string[];
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
      gender: string;
  seeking: string[];
    photos: string[];
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
      gender: string;
  seeking: string[];
    photos: string[];
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
      gender: string;
  seeking: string[];
    photos: string[];
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
      photos: string[];
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
        gender: string;
  seeking: string[];
  };
  Inside: undefined;
};

export type InsideStackParamList = {
  CNCT: undefined;
  details: undefined;
  ChatList: undefined;
  ChatScreen: { chatId: string | null; userId: string };
};
