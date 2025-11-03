import conf from "../config/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create({
        userId: ID.unique(),
        email,
        password,
        name,
      });

      if (userAccount) {
        // Optionally, log in the user or return account details
        return this.login({ email, password });
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async login({ email, password }) {
    return await this.account.createEmailPasswordSession({ email, password });
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite Error in the getCurrentUser: ", error);
    }
    return null;
  }

  async logout() {
    return await this.account.deleteSessions();
  }
}

const authService = new AuthService();

export default authService;
