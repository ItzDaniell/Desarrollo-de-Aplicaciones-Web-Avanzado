import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

// In-memory user store - replace with your database in production
const users: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  emailVerified: Date | null;
}> = [];

// Track login attempts
const loginAttempts = new Map<string, { attempts: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Check for too many failed attempts
        const attemptData = loginAttempts.get(credentials.email) || { attempts: 0, lastAttempt: 0 };
        const now = Date.now();
        
        // Reset attempts if lockout period has passed
        if (now - attemptData.lastAttempt > LOCKOUT_DURATION) {
          loginAttempts.delete(credentials.email);
        } else if (attemptData.attempts >= MAX_LOGIN_ATTEMPTS) {
          const timeLeft = Math.ceil((LOCKOUT_DURATION - (now - attemptData.lastAttempt)) / 60000);
          throw new Error(`Too many attempts. Try again in ${timeLeft} minutes.`);
        }

        const user = users.find(user => user.email === credentials.email);
        
        if (!user) {
          incrementLoginAttempts(credentials.email);
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          incrementLoginAttempts(credentials.email);
          throw new Error('Invalid credentials');
        }

        // Reset attempts on successful login
        loginAttempts.delete(credentials.email);
        
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
    error: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

// Helper function to track login attempts
function incrementLoginAttempts(email: string) {
  const now = Date.now();
  const attemptData = loginAttempts.get(email) || { attempts: 0, lastAttempt: 0 };
  
  // Reset attempts if last attempt was more than LOCKOUT_DURATION ago
  if (now - attemptData.lastAttempt > LOCKOUT_DURATION) {
    attemptData.attempts = 0;
  }
  
  attemptData.attempts += 1;
  attemptData.lastAttempt = now;
  loginAttempts.set(email, attemptData);
}

// In a real app, you would expose this to your registration endpoint
// to add new users to your database
export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    password: hashedPassword,
    emailVerified: null,
  };
  
  users.push(user);
  return { id: user.id, email: user.email, name: user.name };
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };