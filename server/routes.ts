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
          message: validatedData.message,
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

  return httpServer;
}
