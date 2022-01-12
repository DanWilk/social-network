const res = require('express/lib/response');
const { Thoughts, User } = require('../models');

const thoughtController = {
    //get all thoughts
    getThoughts (req, res) {
        Thoughts.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },
    
    //get a single thought by id
    getThoughtById({ params }, res) {
        Thoughts.findOne({_id: params.thoughtId})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with this id!'});
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },
    
    // create thought
    addThought ({ params, body }, res) {
        Thoughts.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate( 
                { _id: params.userId}, 
                { $push: {thoughts: _id} },
                { new: true }
                );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user withthis id found!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            res.status(400).json(err);
        })
    },

    // update a thought
    updateThought({ params, body }, res) {
        Thoughts.findOneAndUpdate(
            {_id: params.thoughtId}, body, {new: true, runValidators: true}
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found with this id!'}) ;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete thought
    deleteThought ({ params }, res) {
        Thoughts.findOneAndDelete({ _id: params.thoughtId })
        .then(deletedThought => {
            if(!deletedThought) {
                return res.status(404).json({ message: 'No thought with this id found' })
            }
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: {thoughts: params.thoughtId} },
                { new: true}
            );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                return res.status(404).json({ message: 'No User found with this id'});
            }
            res.json(dbUserData);
        })
        .catch(err => {
            res.staus(400).json(err);
        });
    },

    //create reaction
    addReaction ({ params, body }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: {reactions: body}},
            { new: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with this id!'});
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    //delete reaction
    deleteReaction ({ params }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: {reactions: { reactionId: params.reactionId } } },
            { new: true}
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                return res.status(404).json({ message: 'No Thought with this id!'});
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    }

}

module.exports = thoughtController