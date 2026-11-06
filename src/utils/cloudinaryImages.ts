import cloudinary from "../providers/cloudinary";

const FOLDER = "ecs-uploads"; // trùng với folder trong generateSignature

// Lấy public_id từ URL dạng:
// https://res.cloudinary.com/<cloud>/image/upload/v123/ecs-uploads/abc.jpg
const URL_RE = new RegExp(
  `res\\.cloudinary\\.com/[^/]+/image/upload/(?:v\\d+/)?(${FOLDER}/[^"'\\s?#.]+)`,
  "gi",
);
export const extractPublicIds = (...texts: (string | null | undefined)[]) => {
  const ids = new Set<string>();
  for (const text of texts) {
    if (!text) continue;
    for (const m of text.matchAll(URL_RE)) {
      const publicId = m[1];
      if (publicId) ids.add(decodeURIComponent(publicId));
    }
  }
  return ids;
};

export const deleteCloudinaryImages = async (publicIds: string[]) => {
  if (publicIds.length === 0) return;
  try {
    for (let i = 0; i < publicIds.length; i += 100) {
      await cloudinary.api.delete_resources(publicIds.slice(i, i + 100), {
        invalidate: true,
      });
    }
  } catch (e) {
    console.error("Xóa ảnh Cloudinary thất bại:", e);
  }
};
