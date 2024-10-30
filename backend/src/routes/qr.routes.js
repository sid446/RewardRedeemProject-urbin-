import { Router } from "express";
import { generateQr, checkQr, Used } from "../controllers/qr.controller.js";

const router = Router();
router.route("/generate").post(generateQr);   // Generates a QR code
router.route("/checkQr").get(checkQr);        // Checks the status of a QR code
router.route("/Used").post(Used);              // Marks a QR code as used

export default router;
