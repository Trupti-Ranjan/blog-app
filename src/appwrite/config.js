import conf from "../config/conf.js";
import { Client, ID, Databases, Permission, Storage, Query } from "appwrite";

export class StorageService {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId,
    permissions,
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        },
        permissions
      );
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
    }
  }

  async deletePost(slug) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error: ", error);
      return false;
    }
  }

  async getSinglepost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      )
    } catch (error) {
      console.log("Apperite serive :: getSignlePost :: error: ", error);
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]){
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteDatabaseId,
        queries,
      )
    } catch (error) {
      console.log("Appwrite :: getPosts :: error: ", error);
      return false
    }
  }

  // file upload service

  async uploadFile(file){
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      )
    } catch (error) {
      console.log("Appwrite :: uploadFile :: error:", error);
      return false
    }
  }

  async deleteFile(fileId){
    try {
      await this.bucket.deleteFile(
        conf.appwriteBucketId,
        fileId
      )
      return true
    } catch (error) {
      console.log("Appwrite :: deleteFile :: error:", error);
      return false
    }
  }

  getFilePreview(fileId){
    return this.bucket.getFilePreview(
      conf.appwriteBucketId,
      fileId
    )
  }
}

const storageService = new StorageService();

export default storageService;
