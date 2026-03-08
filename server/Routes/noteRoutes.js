//Implementing all routes for note related functions

const express = require("express");
const router = express.Router();

const {
  createNote,
  getNote,
  getAllNotes,
  updateNote,
  deleteNote,
  getCollaboratedNotes
} = require("../Controllers/NoteController");

router.post("/", createNote);
router.get("/collaborated", getCollaboratedNotes);
router.get("/", getAllNotes);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);


module.exports = router;