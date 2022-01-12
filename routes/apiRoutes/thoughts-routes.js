const router = require('express').Router();
const {
    getThoughts,
    getThoughtById,
    addThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thoughts-controller')

router
    .route('/')
    .get(getThoughts)

router
    .route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)

router
    .route('/:userId')
    .post(addThought)

router
    .route('/:userId/:thoughtId')
    .delete(deleteThought)

router
    .route('/:thoughtId/reactions')
    .put(addReaction)

router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction)

module.exports = router;