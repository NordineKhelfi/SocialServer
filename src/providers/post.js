export async function recordPostInteraction(db, { userId, postId, interactionType }) {
  await db.UserPostInteraction.create({
    userId,
    postId,
    interactionType
  });

  await recordUserInterests(db, userId, postId);
  await updatePostPopularity(db, postId);
}

export async function recordSeenPost(db, { userId, postId }) {
  await db.UserSeenPost.findOrCreate({
    where: { userId, postId }
  });

  await updatePostPopularity(db, postId);
}

async function updatePostPopularity(db, postId) {
  let interactionCount = await db.UserPostInteraction.count({ where: { postId } });
  let seenCount = await db.UserSeenPost.count({ where: { postId } });

  let popularity = interactionCount / seenCount;
  popularity = popularity || 1;

  await db.Post.update({ popularity }, {
    where: { id: postId }
  });
}

async function recordUserInterests(db, userId, postId) {
  const tags = (await db.PostTag.findAll({ where: { postId } })).map(x => x.tag);

  for (const tag of tags) {
    const userInterest = await db.UserInterest.findOne({
      where: { userId, tag }
    });

    if (userInterest) {
      await db.UserInterest.update({ count: userInterest.count + 1 }, {
        where: { userId, tag }
      });
    } else {
      await db.UserInterest.create({ userId, tag, count: 1 });
    }
  }
}
