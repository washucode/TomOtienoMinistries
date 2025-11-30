import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./email";
import {
  insertVideoSchema,
  insertRegistrationSchema,
  insertMinistrySettingsSchema,
} from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Video Routes
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getAllVideos();
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const validatedData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedData);
      res.status(201).json(video);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error creating video:", error);
      res.status(500).json({ error: "Failed to create video" });
    }
  });

  app.put("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertVideoSchema.partial().parse(req.body);
      const video = await storage.updateVideo(id, validatedData);
      
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      res.json(video);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error updating video:", error);
      res.status(500).json({ error: "Failed to update video" });
    }
  });

  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteVideo(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ error: "Failed to delete video" });
    }
  });

  // Registration Routes
  app.get("/api/registrations", async (req, res) => {
    try {
      const { ministryType } = req.query;
      
      let registrations;
      if (ministryType && typeof ministryType === 'string') {
        registrations = await storage.getRegistrationsByMinistry(ministryType);
      } else {
        registrations = await storage.getAllRegistrations();
      }
      
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });

  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(validatedData);
      
      // Increment registration count for ministry
      await storage.incrementRegistrationCount(validatedData.ministryType);
      
      // Send email notification
      await emailService.sendRegistrationNotification(
        validatedData.ministryType,
        {
          fullName: validatedData.fullName,
          email: validatedData.email,
          phone: validatedData.phone,
          message: validatedData.message || undefined,
        }
      );
      
      res.status(201).json(registration);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error creating registration:", error);
      res.status(500).json({ error: "Failed to create registration" });
    }
  });

  app.delete("/api/registrations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteRegistration(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Registration not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting registration:", error);
      res.status(500).json({ error: "Failed to delete registration" });
    }
  });

  // Ministry Settings Routes
  app.get("/api/ministry-settings", async (req, res) => {
    try {
      const { ministryType } = req.query;
      
      if (ministryType && typeof ministryType === 'string') {
        const settings = await storage.getMinistrySettings(ministryType);
        if (!settings) {
          return res.status(404).json({ error: "Ministry settings not found" });
        }
        res.json(settings);
      } else {
        const allSettings = await storage.getAllMinistrySettings();
        res.json(allSettings);
      }
    } catch (error) {
      console.error("Error fetching ministry settings:", error);
      res.status(500).json({ error: "Failed to fetch ministry settings" });
    }
  });

  app.post("/api/ministry-settings", async (req, res) => {
    try {
      const validatedData = insertMinistrySettingsSchema.parse(req.body);
      const settings = await storage.upsertMinistrySettings(validatedData);
      res.status(201).json(settings);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error updating ministry settings:", error);
      res.status(500).json({ error: "Failed to update ministry settings" });
    }
  });

  // Seed endpoint (for development only)
  app.post("/api/seed", async (req, res) => {
    try {
      // Check if already seeded
      const existingVideos = await storage.getAllVideos();
      if (existingVideos.length > 0) {
        return res.json({ message: "Database already seeded", count: existingVideos.length });
      }

      // Seed videos
      const videoData = [
        { title: "God's Abundant Mercy", videoId: "M7lc1UVf-VE", category: "Sermon", thumbnail: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop", duration: "45:20", views: "1.2K views" },
        { title: "Understanding Holiness", videoId: "M7lc1UVf-VE", category: "Teaching", thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop", duration: "58:45", views: "2.5K views" },
        { title: "The Power of Prayer", videoId: "M7lc1UVf-VE", category: "Sermon", thumbnail: "https://images.unsplash.com/photo-1445445290350-16a63cfaf720?q=80&w=2070&auto=format&fit=crop", duration: "1:02:10", views: "3.1K views" },
        { title: "Walking in Divine Authority", videoId: "M7lc1UVf-VE", category: "Teaching", thumbnail: "https://images.unsplash.com/photo-1490122417551-6ee9691429d0?q=80&w=2070&auto=format&fit=crop", duration: "55:30", views: "1.8K views" },
        { title: "Breaking Free from Fear", videoId: "M7lc1UVf-VE", category: "Sermon", thumbnail: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop", duration: "48:15", views: "2.2K views" },
        { title: "The Art of Worship", videoId: "M7lc1UVf-VE", category: "Worship", thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop", duration: "1:10:00", views: "4.5K views" },
      ];

      for (const video of videoData) {
        await storage.createVideo(video);
      }

      // Seed ministry settings
      const ministrySettingsData = [
        { ministryType: "deal-to-heal", status: "open", nextSessionDate: "December 15, 2024", nextSessionTime: "10:00 AM - 4:00 PM EAT", location: "Nairobi, Kenya", capacity: 50, currentRegistrations: 0 },
        { ministryType: "master-class", status: "upcoming", nextSessionDate: "January 20, 2025", nextSessionTime: "9:00 AM - 12:00 PM EAT", location: "Online via Zoom", capacity: 100, currentRegistrations: 0 },
        { ministryType: "proskuneo", status: "open", nextSessionDate: "First Friday of Every Month", nextSessionTime: "6:00 PM - 9:00 PM EAT", location: "Nairobi Central", capacity: 200, currentRegistrations: 0 },
        { ministryType: "understanding-dreams", status: "closed", nextSessionDate: "TBA", nextSessionTime: "TBA", location: "TBA", capacity: 30, currentRegistrations: 0 },
      ];

      for (const setting of ministrySettingsData) {
        await storage.upsertMinistrySettings(setting);
      }

      res.json({ message: "Database seeded successfully", videosCreated: videoData.length, settingsCreated: ministrySettingsData.length });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  return httpServer;
}
