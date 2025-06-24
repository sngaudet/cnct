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
    };
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
    };
  };
  Inside: undefined;
};

export type InsideStackParamList = {
  "My Todos": undefined;
  details: undefined;
};
