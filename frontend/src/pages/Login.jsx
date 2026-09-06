import React from 'react';
import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';

export default function Login() {
  return (
    <AuthLayout mode="login">
      <AuthForm mode="login" />
    </AuthLayout>
  );
}
