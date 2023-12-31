import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { users, likes, comments, images } from '../index';

export const posts = pgTable('posts', {
  postId: uuid('post_id').defaultRandom().primaryKey(),
  postContent: text('post_content').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade', onUpdate: 'cascade' }),
  imageId: uuid('image_id').references(() => images.imageId, { onDelete: 'cascade', onUpdate: 'cascade' }),
  postEdited: boolean('post_edited').notNull().default(false),
  updatedAt: timestamp('updated_at', { precision: 0, withTimezone: false }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { precision: 0, withTimezone: false }).notNull().defaultNow(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.userId],
  }),
  image: one(images, {
    fields: [posts.imageId],
    references: [images.imageId],
  }),
  likes: many(likes),
  comments: many(comments),
}));

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;
