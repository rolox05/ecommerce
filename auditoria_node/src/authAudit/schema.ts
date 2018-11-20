"use strict";

import { Document, model, Schema, Types } from "mongoose";
import * as env from "../server/environment";

const conf = env.getConfig(process.env);

export interface IUserAudit extends Document {
    userId: string;
    date: number;
    message?: {
        user: string;
        action: string;
    };
    userData?: {
        name: string;
        login: string;
        permissions: string[];
        updated: Date;
        created: Date;
        enabled: Boolean;
    };
}

/**
 * Esquema del usuario auditable
 */
const UserAuditSchema = new Schema({
  userId: {
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
  userData: {
      type: Schema.Types.Mixed
  }
  /*userData: {
    name: {
      type: String,
      required: "nombre de articulo",
      trim: true
    },
    login: {
        type: String,
        required: "login id",
        trim: true
    },
    permissions: {
        type: String,
        required: "permisos",
        trim: true
    },
    updated: {
        type: Date,
        default: Date.now()
    },
    created: {
        type: Date,
        default: Date.now()
    },
    enabled: {
        type: Boolean,
        default: true
    }
  }*/
}, { collection: "userAudit" });

/**
 * Trigger antes de guardar
 */
UserAuditSchema.pre("save", next => {
  this.updated = Date.now();
  console.log("pre save");
  next();
});

export let UserAudit = model<IUserAudit>("userAudit", UserAuditSchema);
