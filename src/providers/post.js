export async function recordPostInteraction(db, { userId, postId, interactionType }) {
  await db.UserPostInteraction.create({
    userId,
    postId,
    interactionType
  });

  await updatePostPopularity(db, postId);
}

export async function recordSeenPost(db, { userId, postId }) {
  await db.UserSeenPost.findOrCreate({
    where: {
      userId,
      postId
    }
  });

  await updatePostPopularity(db, postId);
}

async function updatePostPopularity(db, postId) {
  let interactionCount = await db.UserPostInteraction.count({ where: { postId } });
  let seenCount = await db.UserSeenPost.count({ where: { postId } });

  let popularity = interactionCount / seenCount;
  popularity = popularity || 1;
  console.log({ interactionCount, seenCount, popularity });

  await db.Post.update({ popularity }, {
    where: {
      id: postId
    }
  });
}
