export type RootStackParamList = {
  Login: undefined;
  RegEmailPass: undefined;
  RegHeightWeight: { email: string; password: string };
  RegPersonalDetails: {
    email: string;
    password: string;
    height: string;
    weight: string;
  };
  RegHobbies: {
    email: string;
    password: string;
    height: string;
    weight: string;
    religion: string;
    smoker: string;
    drinker: string;
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
  };
  Inside: undefined;
};

export type InsideStackParamList = {
  "My Todos": undefined;
  details: undefined;
};
