"use strict";

import { Document, model, Schema, Types } from "mongoose";
import * as env from "../server/environment";

const conf = env.getConfig(process.env);

interface IArticle {
  articleId: string;
  quantity: number;
}

export interface IOrderAudit extends Document {
    cartId: string;
    orderId: string;
    userId: string;
    method: string;
    amount: number;
    articles: IArticle[];
    date: number;
}

/**
 * Esquema de la orden auditable
 */
const OrderAuditSchema = new Schema({
  orderId: {
    type: String,
    trim: true,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now()
  },
  cartId: {
    type: String,
    trim: true,
  },
  userId: {
    type: String,
    trim: true,
    default: "",
  },
  method: {
    type: String,
    trim: true,
    default: "",
  },
  amount: {
    type: Number,
  },
  articles: [{
    articleId: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
    },
  }]
}, { collection: "orderAudit" });

/**
 * Trigger antes de guardar
 */
OrderAuditSchema.pre("save", next => {
  this.updated = Date.now();
  console.log("pre save");
  next();
});

export let OrderAudit = model<IOrderAudit>("orderAudit", OrderAuditSchema);
