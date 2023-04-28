export enum InputSignUpEnum {
  firstName,
  lastName,
  email,
  password,
  birthDate,
  gender,
}

export type InvalidInputSignUpType = {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  birthDate: boolean;
  gender: boolean;
};

export const initInvalidInputSignUp = {
  firstName: false,
  lastName: false,
  email: false,
  password: false,
  birthDate: false,
  gender: false,
};
