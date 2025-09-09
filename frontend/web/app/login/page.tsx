'use client';

import { SignInPage } from '@/components/ui/sign-in';
import { FormEvent } from 'react';

export default function LoginPage() {
  const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const rememberMe = formData.get('rememberMe') as string;

    console.log('Sign in attempt:', { email, password, rememberMe });
    // TODO: Implement your sign-in logic here
    // Example: call your authentication API
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
    // TODO: Implement Google sign-in logic here
    // Example: redirect to Google OAuth or use a library like @google-cloud/oauth
  };

  const handleResetPassword = () => {
    console.log('Reset password clicked');
    // TODO: Implement password reset logic here
    // Example: navigate to password reset page or show modal
  };

  const handleCreateAccount = () => {
    console.log('Create account clicked');
    // TODO: Implement account creation logic here
    // Example: navigate to sign-up page
  };

  return (
    <SignInPage
      title={
        <span className="font-light text-foreground tracking-tighter">
          Welcome to <span className="font-semibold">AyushBridge</span>
        </span>
      }
      description="Sign in to your account and continue your learning journey"
      onSignIn={handleSignIn}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
      // Optional: Add hero image and testimonials
      // heroImageSrc="/path-to-your-hero-image.jpg"
      // testimonials={[
      //   {
      //     avatarSrc: "/avatar1.jpg",
      //     name: "John Doe",
      //     handle: "@johndoe",
      //     text: "This platform changed my learning experience!"
      //   }
      // ]}
    />
  );
}
