/** @format */

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Tea = require("./tea.js");
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

/************************************** create */

describe("create", function () {
  let newTea = {
    title: "English Black Tea",
    brand: "PG TIPS",
    description: "Fine English tea made from a reputable company.",
    category: "Black",
    review: "I have been drinking this tea for years now and I love it.",
    country_of_origin: "England",
    organic: false,
    img_url: "https://images.heb.com/is/image/HEBGrocery/000441976",
    brew_time: 3,
    brew_temp: 100,
  };

  test("works", async function () {
    let tea = await Tea.create(newTea);
    expect(tea).toEqual({
      ...newTea,
      id: expect.any(Number),
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works for teas on user1 myTeasList", async function () {
    let userId = 1;
    let isMyTea = true;
    let isWishList = false;
    let teas = await Tea.findAll(userId, isMyTea, isWishList);
    expect(teas).toEqual([
      {
        id: expect.any(Number),
        title: "English Black Tea",
        brand: "PG TIPS",
        description: "Fine English tea made from a reputable company.",
        category: "Black",
        review: "I have been drinking this tea for years now and I love it.",
        country_of_origin: "England",
        organic: false,
        img_url: "https://images.heb.com/is/image/HEBGrocery/000441976",
        brew_time: 3,
        brew_temp: 100,
      },
    ]);
  });

  test("works for teas on user1 myWishList. should be empty", async function () {
    let userId = 1;
    let isMyTea = false;
    let isWishList = true;
    let teas = await Tea.findAll(userId, isMyTea, isWishList);
    expect(teas).toEqual([]);
  });

  test("works for teas on user2 myTeasList. should be empty.", async function () {
    let userId = 2;
    let isMyTea = true;
    let isWishList = false;
    let teas = await Tea.findAll(userId, isMyTea, isWishList);
    expect(teas).toEqual([]);
  });

  test("works for teas on user2 myWishList.", async function () {
    let userId = 2;
    let isMyTea = false;
    let isWishList = true;
    let teas = await Tea.findAll(userId, isMyTea, isWishList);
    console.log(teas);
    expect(teas).toEqual([
      {
        id: 2,
        title: "American Black Tea",
        brand: "Lipton",
        description: "Classic American tea. Come and have a glass!",
        category: "Black",
        review:
          "We usually use this brand when making our southern ice cold sweet tea. Great!",
        country_of_origin: "United States of America",
        organic: false,
        img_url: "https://m.media-amazon.com/images/I/8187SPdp+IL._SL1500_.jpg",
        brew_time: 3,
        brew_temp: 100,
      },
    ]);
  });
});

// /************************************** get */

describe("get", function () {
  test("works", async function () {
    let tea = await Tea.get(1);
    expect(tea).toEqual({
      id: 1,
      title: "English Black Tea",
      brand: "PG TIPS",
      description: "Fine English tea made from a reputable company.",
      category: "Black",
      review: "I have been drinking this tea for years now and I love it.",
      country_of_origin: "England",
      organic: false,
      img_url: "https://images.heb.com/is/image/HEBGrocery/000441976",
      brew_time: 3,
      brew_temp: 100,
    });
  });

  test("not found if no such tea", async function () {
    try {
      await Tea.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** update */

describe("update", function () {
  let updateData = {
    title: "New",
  };
  test("works", async function () {
    let teaId = 1;
    let changedData = { title: "Updated Tea Title" };
    let tea = await Tea.update(teaId, changedData);
    expect(tea).toEqual({
      title: "Updated Tea Title",
      brand: "PG TIPS",
      description: "Fine English tea made from a reputable company.",
      category: "Black",
      review: "I have been drinking this tea for years now and I love it.",
      country_of_origin: "England",
      organic: false,
      img_url: "https://images.heb.com/is/image/HEBGrocery/000441976",
      brew_time: 3,
      brew_temp: 100,
    });
  });

  test("not found if no such tea", async function () {
    try {
      await Tea.update(0, {
        title: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Tea.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// /************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Tea.remove(1);
    const res = await db.query("SELECT id FROM teas WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such tea", async function () {
    try {
      await Tea.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
