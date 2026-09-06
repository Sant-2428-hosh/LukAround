import React from 'react';
import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';

export default function Register() {
  return (
    <AuthLayout mode="register">
      <AuthForm mode="register" />
    </AuthLayout>
  );
}
