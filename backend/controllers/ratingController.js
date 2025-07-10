import { Rating, Store, User } from '../models/index.js';

export const submitOrUpdateRating = async (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.userId;

  try {
    const existing = await Rating.findOne({ where: { storeId, userId } });

    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.status(200).json({ message: 'Rating updated', rating: existing });
    }

    const newRating = await Rating.create({ storeId, userId, rating });
    res.status(201).json({ message: 'Rating submitted', rating: newRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit/update rating' });
  }
};


export const getStoreRatings = async (req, res) => {
  const storeId = req.params.id;

  try {
    const ratings = await Rating.findAll({
      where: { storeId },
      include: {
        model: User,
        attributes: ['id', 'name', 'email'],
      },
    });

    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch ratings' });
  }
};

