const express = require("express");
const noteController = require("../controllers/note.controller")
const router = express.Router();
const auth = require("../middleware/auth.middleware")

router.get("/",auth,noteController.getNotes)
router.post("/",auth,noteController.createNote)
router.put("/:id",auth,noteController.updateNote)
router.delete("/:id",auth,noteController.deleteNote)

module.exports=router;