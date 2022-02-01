/* eslint-disable object-curly-spacing */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp();

const app = express();
const db = admin.firestore();

app.use(cors({ origin: true }));

app.get("/", async (req, res, next) => {
  try {
    const payload = await db.collection("users").get();

    const users = [];

    payload.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      users.push({ id, ...data });
    });

    res.status(200).send(JSON.stringify(users));
  } catch (error) {
    next(error);
  }
});

app.get("/:id", async (req, res, next) => {
  try {
    const payload = await db.collection("users").doc(req.params.id).get();

    const userId = payload.id;
    const userData = payload.data();

    res.status(200).send(JSON.stringify({ userId, ...userData }));
  } catch (error) {
    next(error);
  }
});

app.post("/", async (req, res, next) => {
  try {
    const user = req.body;
    await db.collection("users").add(user);
    res.status(201).send({ user: "created" });
  } catch (error) {
    next(error);
  }
});

app.delete("/:id", async (req, res, next) => {
  try {
    const payload = await db.collection("users").doc(req.params.id).delete();

    res.status(200).send({ payload });
  } catch (error) {
    next(error);
  }
});

exports.user = functions.https.onRequest(app);
