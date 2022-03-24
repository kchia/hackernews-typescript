import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader, AuthTokenPayload } from "./utils/auth";
import { Request } from "express";

export const prisma = new PrismaClient(); // instance has access to all of your database models, effectively allowing you to do all CRUD (create, read, update, delete) operations on the data models you set up in your schema.prisma.

// specify what objects will be attached to the context object
export interface Context {
  prisma: PrismaClient;
  userId?: number; // optional because no userId is present if requests are sent without the bearer token
}

export const context = ({ req }: { req: Request }): Context => {
  // 2
  const token =
    req && req.headers.authorization
      ? decodeAuthHeader(req.headers.authorization)
      : null;

  return {
    prisma,
    userId: token?.userId,
  };
};
