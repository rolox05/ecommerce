"use strict";

import { Document, model, Schema, Types } from "mongoose";
import * as env from "../server/environment";

const conf = env.getConfig(process.env);

export interface IArticleAudit extends Document {
    userId: string;
    userName: string;
    action: string;
    articleId: string;
    articleName: string;
    date: number;
    message?: {
        article: string;
        action: string;
    };
    articleData?: {
        id: string;
        name: string;
        description: string;
        price: number;
        stock: number;
        enabled: Boolean;
    };
}

/**
 * Esquema del articulo auditable
 */
const ArticleAuditSchema = new Schema({
  userId: {
    type: String,
    trim: true,
    default: "",
  },
  userName: {
    type: String,
    trim: true,
    default: "",
  },
  action: {
    type: String,
    trim: true,
    default: "",
  },
  articleName: {
    type: String,
    trim: true,
    default: "",
  },
  articleId: {
    type: String,
    trim: true,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now()
  },
  message: {
    type: Schema.Types.Mixed
  },
  articleData: {
      type: Schema.Types.Mixed
  }
}, { collection: "articleAudit" });

/**
 * Trigger antes de guardar
 */
ArticleAuditSchema.pre("save", next => {
  this.updated = Date.now();
  console.log("pre save");
  next();
});

export let ArticleAudit = model<IArticleAudit>("ArticleAudit", ArticleAuditSchema);
