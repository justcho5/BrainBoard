const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Note = require("../models/note");
const User = require("../models/user");

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});

notesRouter.get("/:id", async (request, response) => {
  const note = await Note.findById(request.params.id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  console.log(authorization);
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

notesRouter.post("/", async (request, response) => {
  const { body } = request;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  // const user = await User.findById(body.userId);
  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id); // save note id to user's note ref ids
  await user.save(); // save the user with the additional note appended
  response.status(201).json(savedNote);
});

notesRouter.put("/:id", async (request, response) => {
  const { body } = request;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  const note = await Note.findById(request.params.id);

  // if not, return 403
  if (user.id !== note.user.toString()) {
    return response.status(403).json({ error: "permission denied" });
  }
  const noteToUpdate = {
    content: body.content,
    important: body.important,
  };

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    noteToUpdate,
    {
      new: true,
    }
  ).populate("user", { username: 1, name: 1 });
  console.log("updatedNote", updatedNote);

  return response.status(201).json(updatedNote);
});

notesRouter.delete("/:id", async (request, response) => {
  // only allow deletion if user is the owner of the note
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  // check if user is the owner of the note
  const user = await User.findById(decodedToken.id);
  const note = await Note.findById(request.params.id);

  // if not, return 403
  if (user.id !== note.user.toString()) {
    return response.status(403).json({ error: "permission denied" });
  }

  // if so, delete
  await Note.findByIdAndDelete(request.params.id);
  //
  user.notes = user.notes.filter((note) => note.id !== request.params.id);
  await user.save();
  response.status(204).end();
});

module.exports = notesRouter;
