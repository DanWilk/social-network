const { User } = require('../models');

const userController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts', 
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //get one user by id
    getUserById ({ params }, res) {
        User.findOne({ _id: params.id})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate('friends')
        .select('-__v')
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            res.status(400).json(err);
        });
    },

    // create a new user
    createUser ({ body }, res) {
        User.create(body)
        .then(dbUserData => {
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // update user
    updateUser ({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {new: true})
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            res.status(400).json(err);
        });
    },

    //delete User
    deleteUser ({ params }, res) {
        User.findOneAndDelete({ _id: params.id})
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            res.status(404).json(err)
        });
    },

    //create friends
    addFriend ({ params }, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            { $push: { friends:  params.friendId} },
            { new: true, runvalidators: true }
        )
        .then(dbUserData => {
            if(!dbUserData) {
                return res.status(404).json({ message: 'No User found with this id!'});
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    //delete friend
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: {friends: params.friendId } },
            { new: true }
        )
        .then(dbUserData => {
            if(!dbUserData) {
                return res.status(404).json({ message: 'No user found with this id!'});
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;