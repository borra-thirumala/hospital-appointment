// src/api/authApi.js
import { DOCTOR_USERS_KEY, PATIENT_USERS_KEY, ADMIN_USERS_KEY } from '../utils/localKeys';

const getUserKeyByRole = (role) => {
  switch (role) {
    case 'doctor':
      return DOCTOR_USERS_KEY;
    case 'patient':
      return PATIENT_USERS_KEY;
    case 'admin':
      return ADMIN_USERS_KEY;
    default:
      return null;
  }
};

export const register = (role, userData) => {
  const key = getUserKeyByRole(role);
  const users = JSON.parse(localStorage.getItem(key)) || [];

  const emailExists = users.find((u) => u.email === userData.email);
  if (emailExists) {
    throw new Error('Email already registered');
  }

  users.push(userData);
  localStorage.setItem(key, JSON.stringify(users));
};

export const login = (role, email, password) => {
  const key = getUserKeyByRole(role);
  const users = JSON.parse(localStorage.getItem(key)) || [];

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const token = 'fake_token_123'; // simulate auth
  return { token, user: { name: user.name, role } };
};
