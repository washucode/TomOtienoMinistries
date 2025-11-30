import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc } from "drizzle-orm";
import {
  users,
  videos,
  registrations,
  ministrySettings,
  type User,
  type InsertUser,
  type Video,
  type InsertVideo,
  type Registration,
  type InsertRegistration,
  type MinistrySettings,
  type InsertMinistrySettings,
} from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Video methods
  getAllVideos(): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: string, video: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: string): Promise<boolean>;

  // Registration methods
  getAllRegistrations(): Promise<Registration[]>;
  getRegistrationsByMinistry(ministryType: string): Promise<Registration[]>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  deleteRegistration(id: string): Promise<boolean>;

  // Ministry Settings methods
  getAllMinistrySettings(): Promise<MinistrySettings[]>;
  getMinistrySettings(ministryType: string): Promise<MinistrySettings | undefined>;
  upsertMinistrySettings(settings: InsertMinistrySettings): Promise<MinistrySettings>;
  incrementRegistrationCount(ministryType: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Video methods
  async getAllVideos(): Promise<Video[]> {
    return db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const result = await db.select().from(videos).where(eq(videos.id, id));
    return result[0];
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const result = await db.insert(videos).values(video).returning();
    return result[0];
  }

  async updateVideo(id: string, video: Partial<InsertVideo>): Promise<Video | undefined> {
    const result = await db.update(videos).set(video).where(eq(videos.id, id)).returning();
    return result[0];
  }

  async deleteVideo(id: string): Promise<boolean> {
    const result = await db.delete(videos).where(eq(videos.id, id)).returning();
    return result.length > 0;
  }

  // Registration methods
  async getAllRegistrations(): Promise<Registration[]> {
    return db.select().from(registrations).orderBy(desc(registrations.createdAt));
  }

  async getRegistrationsByMinistry(ministryType: string): Promise<Registration[]> {
    return db
      .select()
      .from(registrations)
      .where(eq(registrations.ministryType, ministryType))
      .orderBy(desc(registrations.createdAt));
  }

  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const result = await db.insert(registrations).values(registration).returning();
    return result[0];
  }

  async deleteRegistration(id: string): Promise<boolean> {
    const registration = await db.select().from(registrations).where(eq(registrations.id, id));
    if (registration.length === 0) return false;
    
    const ministryType = registration[0].ministryType;
    const result = await db.delete(registrations).where(eq(registrations.id, id)).returning();
    
    if (result.length > 0) {
      await this.decrementRegistrationCount(ministryType);
    }
    return result.length > 0;
  }

  async decrementRegistrationCount(ministryType: string): Promise<void> {
    const settings = await this.getMinistrySettings(ministryType);
    if (settings && (settings.currentRegistrations || 0) > 0) {
      await db
        .update(ministrySettings)
        .set({ currentRegistrations: (settings.currentRegistrations || 0) - 1 })
        .where(eq(ministrySettings.ministryType, ministryType));
    }
  }

  // Ministry Settings methods
  async getAllMinistrySettings(): Promise<MinistrySettings[]> {
    return db.select().from(ministrySettings);
  }

  async getMinistrySettings(ministryType: string): Promise<MinistrySettings | undefined> {
    const result = await db
      .select()
      .from(ministrySettings)
      .where(eq(ministrySettings.ministryType, ministryType));
    return result[0];
  }

  async upsertMinistrySettings(settings: InsertMinistrySettings): Promise<MinistrySettings> {
    const existing = await this.getMinistrySettings(settings.ministryType);
    
    if (existing) {
      const result = await db
        .update(ministrySettings)
        .set(settings)
        .where(eq(ministrySettings.ministryType, settings.ministryType))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(ministrySettings).values(settings).returning();
      return result[0];
    }
  }

  async incrementRegistrationCount(ministryType: string): Promise<void> {
    const settings = await this.getMinistrySettings(ministryType);
    if (settings) {
      await db
        .update(ministrySettings)
        .set({ currentRegistrations: (settings.currentRegistrations || 0) + 1 })
        .where(eq(ministrySettings.ministryType, ministryType));
    }
  }
}

export const storage = new DatabaseStorage();
