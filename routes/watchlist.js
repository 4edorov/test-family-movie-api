import express from "express";

import { getWatchlist, addMovie, updateMovie, deleteMovie } from "../utils/db.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/:userId", authenticate, (req, res) => {
  const userId = Number(req.params.userId);

  const watchlist = getWatchlist(userId);

  res.status(200).json({ watchlist });
});

router.post("/:userId/movies", authenticate, (req, res) => {
  const role = req.user.role;
  const userId = Number(req.params.userId);
  const movie = req.body;

  if (role === "parent") {
    addMovie(userId, movie);

    return res
      .status(201)
      .send();
  }

  const ownUserId = req.user.id;

  if (role === "child" && ownUserId !== userId) {
    return res
      .status(403)
      .send();
  }

  if (role === "child" && ownUserId === userId) {
    addMovie(userId, movie);

    return res
      .status(201)
      .send();
  }
});

router.put("/:userId/movies/:movieId", authenticate, (req, res) => {
  const role = req.user.role;
  const userId = Number(req.params.userId);
  const movie = req.body;
  const movieId = Number(req.params.movieId);

  if (role === "parent") {
    updateMovie(userId, movieId, movie);

    return res
      .status(200)
      .send();
  }

  const ownUserId = req.user.id;

  if (role === "child" && ownUserId !== userId) {
    return res.status(403).send();
  }

  if (role === "child" && ownUserId === userId) {
    updateMovie(userId, movieId, movie);

    return res
      .status(200)
      .send();
  }
});

router.delete("/:userId/movies/:movieId", authenticate, (req, res) => {
  const role = req.user.role;
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);

  if (role === "parent") {
    deleteMovie(userId, movieId);

    return res.status(200).send();
  }

  const ownUserId = req.user.id;

  if (role === "child" && ownUserId !== userId) {
    return res.status(403).send();
  }

  if (role === "child" && ownUserId === userId) {
    deleteMovie(userId, movieId);

    return res
      .status(200)
      .send();
  }
});

export default router;

