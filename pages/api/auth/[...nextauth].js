import NextAuth from 'next-auth';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';

const APIbaseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';

export const authOptions = {
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${APIbaseURL}auth/token/obtain/`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (res.ok && data) {
          return data;
        }

        return null;
      },
    }),
  ],
  // callback
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.accessToken = user.access;
        token.refreshToken = user.refresh;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token.accessToken) {
        session.accessToken = token.accessToken;

        // Get iat and exp from apiToken, decode it, and set it on the session.
        const decode = jwt_decode(token.accessToken);
        session.iat = decode.iat;
        session.exp = decode.exp;
        session.jti = decode.jti;
        session.expires = new Date(decode.exp * 1000).toISOString();
        session.user = {
          user_id: decode.user_id,
          username: decode.username,
        };
        // Add header to axios.
        axios.defaults.headers.common.Authorization = `JWT ${token.accessToken}`;
      }
      if (token.refreshToken) {
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
