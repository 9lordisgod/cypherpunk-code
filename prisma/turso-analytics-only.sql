-- Run once on an existing Turso database to add anonymous analytics.
-- Safe to run if the table already exists only when you skip this file.

CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitorId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "resourceId" TEXT,
    "courseSlug" TEXT,
    "chapterSlug" TEXT,
    "signedIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_path_idx" ON "AnalyticsEvent"("path");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_visitorId_createdAt_idx" ON "AnalyticsEvent"("visitorId", "createdAt");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_signedIn_createdAt_idx" ON "AnalyticsEvent"("signedIn", "createdAt");