const noteModel = require("../models/note.model");

async function createNote(req, res) {
    try {
        const { title, content, category, color, favorite, pinned } = req.body;
        const user = req.user.id;
        const newNote = await noteModel.create({
            user,
            title,
            content,
            category,
            color,
            favorite,
            pinned
        });
        res.status(201).json({ message: "Note Created Successfully", note: newNote });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


async function getNotes(req, res) {
    try {
        const notes = await noteModel.find(
            { user: req.user.id }
        ).sort({ pinned: -1, createdAt: -1 })

        res.json(notes)

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateNote(req, res) {
    try {
        const note = await noteModel.findOneAndUpdate({
            _id: req.params.id,
            user: req.user.id
        },
            req.body,
            {
                returnDocument: 'after'
            })
        if (!note) {
            res.status(404).json({
                message: "No notes found"
            })
        }
        res.json({
            message: "Note updated successfully",
            note
        });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    

}


async function deleteNote(req, res) {
    try {
        await noteModel.findByIdAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        res.json({
            message: "Note deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { createNote, getNotes, updateNote, deleteNote }