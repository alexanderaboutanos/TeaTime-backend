/** @format */

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("testuser1", "password");
    expect(user).toEqual({
      id: 1,
      username: "testuser1",
      firstName: "Test",
      lastName: "User1",
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("c1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    username: "testuser3",
    firstName: "Test",
    lastName: "User1",
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual({ ...newUser, id: 3 });
    const found = await db.query(
      "SELECT * FROM users WHERE username = 'testuser3'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// /************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get("1");
    expect(user).toEqual({
      id: 1,
      username: "testuser1",
      first_name: "Test",
      last_name: "User1",
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get(100);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** getTeas */

describe("getTeas", function () {
  test("works for user1", async function () {
    let teaArr = await User.getMyTeas(1);
    expect(teaArr).toEqual([1]);
  });
  test("works for user2", async function () {
    let teaArr = await User.getMyTeas(2);
    expect(teaArr).toEqual([2]);
  });
});
