import { Request, Response } from "express";
import { reconcileIdentity } from "../services/identify.service";

export const identifyContact = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body || {};

    // Validate body presence
    if (!email && !phoneNumber) {
      return res.status(400).json({
        error: "At least one of email or phoneNumber is required",
      });
    }

    // Type validation
    if (
      (email && typeof email !== "string") ||
      (phoneNumber && typeof phoneNumber !== "string")
    ) {
      return res.status(400).json({
        error: "Email and phoneNumber must be strings",
      });
    }

    const result = await reconcileIdentity(email, phoneNumber);

    return res.status(200).json({
      contact: result,
    });
  } catch (error) {
    console.error("Identify Error:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};