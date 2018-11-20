"use strict";

import { Document, model, Schema, Types } from "mongoose";
import * as env from "../server/environment";

const conf = env.getConfig(process.env);

export interface IImageAudit extends Document {
    imageId: string;
    action: string;
    date: number;
}

/**
 * Esquema de la imagen auditable
 */
const ImageAuditSchema = new Schema({
  imageId: {
    type: String,
    trim: true,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now()
  },
  action: {
    type: String,
    trim: true,
    default: "",
  },
}, { collection: "imageAudit" });

/**
 * Trigger antes de guardar
 */
ImageAuditSchema.pre("save", next => {
  this.updated = Date.now();
  console.log("pre save");
  next();
});

export let ImageAudit = model<IImageAudit>("imageAudit", ImageAuditSchema);
