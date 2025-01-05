import * as yup from 'yup';

export const playerRegistrationSchema = yup.object().shape({
  email: yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  username: yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .required('Username is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  nickname: yup.string().required('Nickname is required'),
  dateOfBirth: yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  preferredGames: yup.array()
    .min(1, 'Select at least one game')
    .required('Preferred games are required')
});

export const teamRegistrationSchema = yup.object().shape({
  teamName: yup.string()
    .min(3, 'Team name must be at least 3 characters')
    .required('Team name is required'),
  teamTag: yup.string()
    .min(2, 'Team tag must be at least 2 characters')
    .max(4, 'Team tag must be less than 5 characters')
    .required('Team tag is required')
}); 