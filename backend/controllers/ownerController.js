import { Store, Rating, User } from '../models/index.js';

export const getOwnerDashboard = async (req, res) => {
  const ownerId = req.user.userId;

  try {
    // Find store owned by this user
    const store = await Store.findOne({ where: { ownerId } });
    if (!store) return res.status(404).json({ message: 'Store not found for this owner' });

    // Get all ratings for this store, include user details
    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    // Calculate average rating
    const avgRating =
      ratings.reduce((acc, r) => acc + r.rating, 0) / (ratings.length || 1);

    res.json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: Number(avgRating.toFixed(2)),
      },
      ratings: ratings.map(r => ({
        id: r.id,
        rating: r.rating,
        createdAt: r.createdAt,
        user: r.User
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};
