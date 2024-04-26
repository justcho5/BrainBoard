const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");

const supertest = require("supertest");
const api = supertest(app);
const helper = require("./test_helper");

const Note = require("../models/note");
const User = require("../models/user");

describe("when there is initially some notes saved", () => {
  beforeEach(async () => {
    await Note.deleteMany({});

    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash, notes: [] });
    const savedUser = await user.save();
    const userid = savedUser.id;
    const notes = helper.initialNotes.map((b) => ({ ...b, user: userid }));

    const savedNotes = await Note.insertMany(notes);
    user.notes = user.notes.concat(...savedNotes.map((b) => b.id));

    await user.save();
  });
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(helper.initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");

    const contents = response.body.map((r) => r.content);

    expect(contents).toContain("Browser can execute only JavaScript");
  });

  describe("viewing a specific note", () => {
    test("succeeds with a valid id", async () => {
      const notesAtStart = await helper.notesInDb();

      const noteToView = notesAtStart[0];
      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
      const body = resultNote.body;
      body.user = body.user.toString();
      expect(body[("content", "id", "important")]).toEqual(
        noteToView[("content", "id", "important")]
      );
    });

    test("fails with statuscode 404 if note does not exist", async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api.get(`/api/notes/${validNonexistingId}`).expect(404);
    });

    test("fails with statuscode 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.get(`/api/notes/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new note", () => {
    let userToken;
    const targetUser = {
      username: "root",
      password: "sekret",
    };
    beforeEach(async () => {
      const userResult = await api
        .post("/api/login")
        .send(targetUser)
        .expect(200);

      const { token } = userResult.body;
      userToken = token;
    });
    test("succeeds with valid data and valid token", async () => {
      const newNote = {
        content: "async/await simplifies making async calls",
        important: true,
      };

      const savedNote = await api
        .post("/api/notes")
        .set("Authorization", `Bearer ${userToken}`)
        .send(newNote)
        .expect(201)
        .expect("Content-Type", /application\/json/);
      const notesAtEnd = await helper.notesInDb();
      expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

      const contents = notesAtEnd.map((n) => n.content);
      expect(contents).toContain("async/await simplifies making async calls");

      const allUsers = await api.get("/api/users");

      const targetUserNotes = allUsers.body.filter(
        (u) => u.username === targetUser.username
      )[0];
      expect(targetUserNotes.notes.map((n) => n.content)).toContain(
        savedNote.body.content
      );
    });

    test("fails with status code 400 if data invalid", async () => {
      const newNote = {
        important: true,
      };

      await api
        .post("/api/notes")
        .set("Authorization", `Bearer ${userToken}`)
        .send(newNote)
        .expect(400);

      const notesAtEnd = await helper.notesInDb();

      expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
    });
    test("fails with valid data and token missing", async () => {
      const newNote = {
        content: "async/await simplifies making async calls",
        important: true,
      };

      const savedNote = await api
        .post("/api/notes")
        .send(newNote)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const notesAtEnd = await helper.notesInDb();

      expect(notesAtEnd).toHaveLength(helper.initialNotes.length);

      const allUsers = await api.get("/api/users");

      const targetUserNotes = allUsers.body.filter(
        (u) => u.username === targetUser.username
      )[0];
      expect(targetUserNotes.notes.map((n) => n.content)).not.toContain(
        savedNote.body.content
      );
    });
  });

  describe("deletion of a note", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToDelete = notesAtStart[0];

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

      const notesAtEnd = await helper.notesInDb();

      expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

      const contents = notesAtEnd.map((r) => r.content);

      expect(contents).not.toContain(noteToDelete.content);
    });
  });
});
describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toEqual(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(result.body.error).toContain("expected `username` to be unique");

    expect(usersAtEnd.length).toEqual(usersAtStart.length);
  });
});
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
