import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "login",
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials, req) {
        const response = await fetch("http://localhost:8088/api/user/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });
        const result = await response.json();
        if (result?.token) {
          try {
            const sub = jwt.decode(result.token).sub;
            const name = jwt.decode(result.token).name;
            const email = jwt.decode(result.token).email;

            // Aqui você precisa adaptar dependendo da estrutura do seu JWT
            return {
              id: sub, // O 'sub' geralmente contém o nome de usuário
              name: name, // Extrai o nome do usuário do token
              email: email, // Extrai o email do usuário do token
            };
          } catch (error) {
            throw new Error("Failed to decode the token.");
          }
        } else {
          console.log("Erro ao gerat roken");
          throw new Error(result.errors[0] || "Login failed."); // Returning the error from your backend or a generic error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      session = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions };
