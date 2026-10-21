import z from "zod";

const createArticleSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Tiêu đề không được để trống")
      .max(255, "Tiêu đề tối đa 255 ký tự"),

    slug: z
      .string()
      .min(1, "Slug không được để trống")
      .max(255, "Slug tối đa 255 ký tự")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug không hợp lệ"),

    description: z.string().min(1, "Mô tả không được để trống"),

    content: z.string().min(1, "Nội dung không được để trống"),

    thumbnail_url: z
      .url({ message: "URL hình ảnh không hợp lệ" })
      .nullable()
      .optional(),

    category_id: z.uuid({ message: "Category ID phải là UUID hợp lệ" }),

    is_published: z.boolean().default(false),

    published_at: z.coerce
      .date({ message: "Thời gian xuất bản phải là ngày hợp lệ" })
      .nullable()
      .optional(),
  }),
});

const updateArticleSchema = z.object({
  body: createArticleSchema.shape.body.partial(),
});

export const articleValidation = {
  createArticleSchema,
  updateArticleSchema,
};
