/* eslint-disable no-undef */
describe("Note app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Admin",
      username: "admin",
      password: "password",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("");
  });
  it("front page can be opened", function () {
    cy.contains("Notes");
    cy.contains("Note app 2023");
  });

  it("login form can be opened", function () {
    cy.contains("Sign in").click();
    cy.get("html").should("contain", "username");
  });

  it("user can login", function () {
    cy.contains("Sign in").click();
    cy.get("#username").type("admin");
    cy.get("#password").type("password");
    cy.get("#login-button").click();

    cy.contains("Admin logged-in");
  });

  it("login fails with wrong password", function () {
    cy.contains("Sign in").click();
    cy.get("#username").type("admin");
    cy.get("#password").type("wrong");
    cy.get("#login-button").click();

    cy.get(".error").contains("Wrong credentials");
    cy.get(".error")
      .should("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");

    cy.get("html").should("not.contain", "Admin logged-in");
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "admin", password: "password" });
    });

    it("a new note can be created", function () {
      cy.createNote({ content: "a note created by cypress" });

      cy.contains("a note created by cypress");
    });

    describe("and a note exists", function () {
      beforeEach(function () {
        cy.createNote({
          content: "another note cypress",
          important: true,
        });
      });

      it("it can be made not important", function () {
        cy.contains("another note cypress").parent().find("button").click();

        cy.contains("another note cypress")
          .parent()
          .should("contain", "make important");
      });
    });

    describe("and several notes exist", function () {
      beforeEach(function () {
        cy.login({ username: "admin", password: "password" });
        cy.createNote({ content: "first note", important: false });
        cy.createNote({ content: "second note", important: false });
        cy.createNote({ content: "third note", important: false });
      });

      it("there are three notes", function () {
        cy.contains("first note");
        cy.contains("second note");
        cy.contains("third note");
      });

      it("one of those can be made important", function () {
        cy.contains("third note").parent().find("button").as("theButton");
        cy.get("@theButton").click();
        cy.get("@theButton").should("contain", "make not important");
      });
    });
  });
});
