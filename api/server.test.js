// Write your tests here
const db = require("../data/dbConfig");
const server = require("./server");
const request = require("supertest");

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest();
})

describe("[REGISTER Endpoint /api/auth/register]", () => {
  test("[1]Returns newly registered user", async () => {
    const user = { username: "alaina", password: "alainalang" };
    const res = await request(server).post("/api/auth/register").send(user);
    expect(res.body).toHaveProperty("username","alaina")
    expect(res.body).toHaveProperty("id");
    expect(res.status).toBe(201);
  })
  test("[2]Tests error handling for username that is taken", async () => {
    const user = { username: "jacob", password: "jacoblang" };
    await request(server).post("/api/auth/register").send(user);
    const user2 = { username: "jacob", password: "jacoblang" };
    const res = await request(server).post("/api/auth/register").send(user2);
    expect(res.body.message).toBe("username taken")
    expect(res.status).toBe(400);
  })
  test("[3]Tests error handling for missing username or password", async () => {
    const user = { password: "test" };
    let res = await request(server).post("/api/auth/register").send(user);
    expect(res.body.message).toBe("username and password required");
    expect(res.status).toBe(422);
    const user2 = { username: "test" };
    res = await request(server).post("/api/auth/register").send(user2);
    expect(res.body.message).toBe("username and password required");
    expect(res.status).toBe(422)
  })
})

describe("[LOGIN Endpoint /api/auth/login]", () => {
  beforeEach(async () => {
    const user = { username: "jacob", password: "jacoblang" };
    await request(server).post("/api/auth/register").send(user);
  })
  test("[4]Returns token and message on successful login", async () => {
    const user = { username: "jacob", password: "jacoblang" };
    let res = await request(server).post("/api/auth/login").send(user);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Welcome, jacob");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("token");
  })
  test("[5]Tests error handling for missing username or password", async () => {
    const userWithoutPass = { username: "jacob" };
    const userWithoutUser = { password: "jacob" };
    let res = await request(server).post("/api/auth/login").send(userWithoutPass);
    expect(res.status).toBe(422);
    expect(res.body.message).toBe("username and password required");
    res = await request(server).post("/api/auth/login").send(userWithoutUser);
    expect(res.status).toBe(422);
    expect(res.body.message).toBe("username and password required");
  })
  test("[6]Tests error handling for incorrect username or password", async () => {
    const userWithIncorrectPass = { username: "jacob", password: 'jacobjacobjacob' };
    const userWithIncorrectUser = { username: "jacobb", password: "jacoblang" };
    let res = await request(server).post("/api/auth/login").send(userWithIncorrectPass);
    expect(res.status).toBe(401);
    expect(res.body.message).toEqual("invalid credentials");
    res = await request(server).post("/api/auth/login").send(userWithIncorrectUser);
    expect(res.status).toBe(401);
    expect(res.body.message).toEqual("invalid credentials");
  })
})


describe("[JOKES endpoint /api/jokes]", () => {
  beforeEach(async () => {
    const user = { username: "jacob", password: "jacoblang" }
    await request(server).post("/api/auth/register").send(user);
  })
  test("[7]Can successfully access jokes if token is correct", async () => {
    const user = { username: "jacob", password: "jacoblang" };
    const res = await request(server).post("/api/auth/login").send(user);
    expect(res.body.token).toBeTruthy()
    const token = res.body.token;
    const res2 = await request(server).get("/api/jokes").set('Authorization', `${token}`);
    expect(res2.body).toMatchObject(
      [
        {
          "id": "0189hNRf2g",
          "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
        },
        {
          "id": "08EQZ8EQukb",
          "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."
        },
        {
          "id": "08xHQCdx5Ed",
          "joke": "Why didn’t the skeleton cross the road? Because he had no guts."
        }
      ]
    )
    expect(res2.status).toBe(200);
  })
  test("[8]Proper error handling for invalid token", async () => {
    const user = { username: "jacob", password: "jacoblang" };
    const res = await request(server).post("/api/auth/login").send(user);
    const token = res.body.token;
    const res2 = await request(server).get("/api/jokes").set('Authorization', `${token}r`);
    expect(res2.status).toBe(401);
    expect(res2.body.message).toBe("token invalid");
  })
  test("[9]Proper error handling for missing token", async () => {
    const user = { username: "jacob", password: "jacoblang" };
    await request(server).post("/api/auth/login").send(user);
    const res2 = await request(server).get("/api/jokes");
    expect(res2.status).toBe(401);
    expect(res2.body.message).toBe("token required");
  })
})
