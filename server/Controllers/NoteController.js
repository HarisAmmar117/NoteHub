const Note = require("../Models/Note");


//Create note
exports.createNote = async (req, res) => {
  try {
    const { title, content, collaborators } = req.body;

    const note = await Note.create({
      title,
      content,
      user: req.user.id,
      collaborators: collaborators || []
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one note 
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all notes of logged-in user
exports.getAllNotes = async (req, res) => {
  try {
    // Use the user ID from the JWT token (req.user.id)
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    const { title, content, collaborators } = req.body;

    if (title) note.title = title;
    if (content) note.content = content;
    if (collaborators) note.collaborators = collaborators;

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    await Note.findByIdAndDelete(req.params.id); // ✅ modern way
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getCollaboratedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      collaborators: req.user.id,
      user: { $ne: req.user.id } 
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};