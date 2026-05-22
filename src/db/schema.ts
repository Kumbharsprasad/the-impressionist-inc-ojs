import { pgTable, serial, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('role', ['admin', 'editor', 'author', 'reviewer']);
export const submissionStatusEnum = pgEnum('submission_status', ['draft', 'submitted', 'under_review', 'revision_requested', 'revision_submitted', 'accepted', 'rejected']);
export const reviewDecisionEnum = pgEnum('review_decision', ['accept', 'revision', 'reject']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').default('author').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const submissions = pgTable('submissions', {
    id: serial('id').primaryKey(),
    authorId: integer('author_id').references(() => users.id).notNull(),
    conferenceId: integer('conference_id').references(() => conferences.id), // Link to a room/conference
    title: text('title').notNull(),
    abstract: text('abstract').notNull(),
    theme: text('theme'),
    keywords: text('keywords'),
    pdfUrl: text('pdf_url').notNull(),
    status: submissionStatusEnum('status').default('draft').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const conferences = pgTable('conferences', {
    id: serial('id').primaryKey(),
    editorId: integer('editor_id').references(() => users.id).notNull(),
    name: text('name').notNull(),
    theme: text('theme').notNull(),
    agenda: text('agenda'),
    roomKey: text('room_key').notNull().unique(), // Unique key for invitations
    createdAt: timestamp('created_at').defaultNow(),
});

export const conferenceParticipants = pgTable('conference_participants', {
    id: serial('id').primaryKey(),
    conferenceId: integer('conference_id').references(() => conferences.id).notNull(),
    userId: integer('userId').references(() => users.id).notNull(),
    role: userRoleEnum('role').notNull(), // Role within the room
    joinedAt: timestamp('joined_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
    id: serial('id').primaryKey(),
    submissionId: integer('submission_id').references(() => submissions.id).notNull(),
    reviewerId: integer('reviewer_id').references(() => users.id).notNull(),
    feedback: text('feedback'),
    decision: reviewDecisionEnum('decision'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow(),
});
