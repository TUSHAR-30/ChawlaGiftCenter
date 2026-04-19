import { UnboxingVideo } from "../models/UnboxingVideo.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function buildPagination(query) {
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50);
  const hasExplicitSkip = query.skip !== undefined;
  const skip = Math.max(Number(query.skip) || 0, 0);
  const page = hasExplicitSkip ? Math.floor(skip / limit) + 1 : Math.max(Number(query.page) || 1, 1);
  const resolvedSkip = hasExplicitSkip ? skip : (page - 1) * limit;

  return { page, limit, skip: resolvedSkip };
}

export const getUnboxingVideos = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const { page, limit, skip } = buildPagination(req.query);
  const filters = {};

  if (search) {
    filters.$text = { $search: search };
  }

  const [items, total] = await Promise.all([
    UnboxingVideo.find(filters)
      .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit),
    UnboxingVideo.countDocuments(filters),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      skip,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + items.length < total,
    },
  });
});
