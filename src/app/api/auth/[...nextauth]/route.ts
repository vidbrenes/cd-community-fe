import NextAuth from "next-auth";
// import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

type FormData = { [key: string]: string }
 
// Function to convert an object to URL-encoded form data
function toFormData(obj: FormData) {
  const formBody = [];
  for (const property in obj) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(obj[property]);
    formBody.push(`${encodedKey}=${encodedValue}`);
  }
  return formBody.join("&");
}

const authOptions : NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith", value: "administrator" },
        password: { label: "Password", type: "password", value: "admin" },
      },
      
      async authorize(credentials, req) {
        // Include hidden values here
        const data = {
          username: credentials?.username,
          password: credentials?.password,
        };
        const formData = toFormData(data as FormData);

        try {
          // const res = await fetch("http://localhost:8000/api/auth/login", {
          const res = await fetch("https://safe-ocean-02246-b1b13c749770.herokuapp.com/api/auth/login", {
            method: 'POST',
            body: formData,
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded",
            }
          });

          const resData = await res.json();
          if (res.ok && resData && resData.data) {
            return resData.data;
          } else {
            console.error('Authorization failed:', resData);
            return null;
          }
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({token, user}){
      return {...token, ...user}
    },
    async session ({ session, token, user }) {
      session.user = token as any ;
      return session;
    }
  }
  
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };