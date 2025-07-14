import { supabase } from './supabase';
import { redirect } from 'next/navigation';

// Check if user is authenticated
export async function isAuthenticated() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error signing in:', error);
    return { data: null, error: error.message };
  }
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error signing up:', error);
    return { data: null, error: error.message };
  }
}

// Sign out
export async function signOut() {
  try {
    await supabase.auth.signOut();
    return { error: null };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { error: error.message };
  }
}

// Redirect if not authenticated
export function redirectIfNotAuthenticated(isAuth: boolean, redirectTo: string = '/login') {
  if (!isAuth) {
    redirect(redirectTo);
  }
}

// Redirect if authenticated
export function redirectIfAuthenticated(isAuth: boolean, redirectTo: string = '/dashboard') {
  if (isAuth) {
    redirect(redirectTo);
  }
}
