import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma"; // Adjust the path as needed

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	adapter: PrismaAdapter(prisma),
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async session({ session, token, user }) {
			console.log("Session Callback:", { session, token, user }); // Logging the session callback data
			if (token && token.email) {
				session.user!.email = token.email;
			}
			return session;
		},
		async signIn({ user, account, profile, email, credentials }) {
			console.log("SignIn Callback:", {
				user,
				account,
				profile,
				email,
				credentials,
			}); // Logging the signIn callback data
			return true;
		},
		async redirect({ url, baseUrl }) {
			// Example: Redirect to /dashboard after successful login
			return url.startsWith(baseUrl) ? `${baseUrl}/dashboard` : baseUrl;
		},
		async jwt({ token, user, account, profile, isNewUser }) {
			console.log("JWT Callback:", {
				token,
				user,
				account,
				profile,
				isNewUser,
			}); // Logging the JWT callback data
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
	},
	events: {
		async signIn(message) {
			console.log("SignIn Event:", message); // Logging the signIn event
		},
		async signOut(message) {
			console.log("SignOut Event:", message); // Logging the signOut event
		},
		async createUser(message) {
			console.log("CreateUser Event:", message); // Logging the createUser event
		},
		async updateUser(message) {
			console.log("UpdateUser Event:", message); // Logging the updateUser event
		},
		async linkAccount(message) {
			console.log("LinkAccount Event:", message); // Logging the linkAccount event
		},
		async session(message) {
			console.log("Session Event:", message); // Logging the session event
		},
	},
	debug: true, // Enabling NextAuth debug mode
});

export { handler as GET, handler as POST };
