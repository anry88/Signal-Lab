-- Migration: initial ScenarioRun table for Signal Lab
-- Generated manually to support Phase 1 foundation in environments without DB access.

-- CreateTable
CREATE TABLE "ScenarioRun" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "duration" INTEGER,
  "error" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ScenarioRun_pkey" PRIMARY KEY ("id")
);
