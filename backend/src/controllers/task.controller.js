const taskModel = require("../models/task.model");

async function getTask(req, res) {
    try{

        const tasks = await taskModel.find({user:req.user.id})
        .sort({createdAt:-1});

        res.json(tasks);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};


async function createTask(req, res) {
    try {

        const { text, reminder } = req.body;

        const task = await taskModel.create({
            user: req.user.id,
            text,
            reminder
        });

        res.status(201).json(task);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateTask(req, res) {

    try{

        const task = await taskModel.findOneAndUpdate(
            {
                _id:req.params.id,
                user:req.user.id
            },
            req.body,
            {
                returnDocument: 'after'
            }
        );

        res.json(task);

    }catch(err){
        res.status(500).json({message:err.message});
    }
}


async function deleteTask(req, res) {

    try{

        await taskModel.findOneAndDelete({
            _id:req.params.id,
            user:req.user.id
        });

        res.json({message:"Task deleted"});

    }catch(err){
        res.status(500).json({message:err.message});
    }

};

module.exports = {getTask,createTask,deleteTask,updateTask}
