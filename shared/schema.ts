import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  videoId: text("video_id").notNull(), // YouTube video ID
  category: text("category").notNull(), // Sermon, Teaching, Worship
  thumbnail: text("thumbnail"),
  duration: text("duration"),
  views: text("views").default("0 views"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const registrations = pgTable("registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ministryType: text("ministry_type").notNull(), // deal-to-heal, master-class, proskuneo, understanding-dreams
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ministrySettings = pgTable("ministry_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ministryType: text("ministry_type").notNull().unique(), // deal-to-heal, master-class, etc.
  status: text("status").notNull().default("upcoming"), // open, closed, upcoming
  nextSessionDate: text("next_session_date"),
  nextSessionTime: text("next_session_time"),
  location: text("location"),
  capacity: integer("capacity"),
  currentRegistrations: integer("current_registrations").default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  createdAt: true,
});

export const insertMinistrySettingsSchema = createInsertSchema(ministrySettings).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;

export type InsertMinistrySettings = z.infer<typeof insertMinistrySettingsSchema>;
export type MinistrySettings = typeof ministrySettings.$inferSelect;
