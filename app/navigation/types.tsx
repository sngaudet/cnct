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
  RegProfile: {
    email: string;
    password: string;
    height: string;
    weight: string;
    religion: string;
    smoker: string;
    drinker: string;
  };
  Inside: undefined;
};

export type InsideStackParamList = {
  "My Todos": undefined;
  details: undefined;
};
