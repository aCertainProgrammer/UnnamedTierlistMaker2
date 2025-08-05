import { expect, test } from "vitest";
import { capitalize } from "../src/util.ts";

test("Capitalizes a lowercase word", () => {
	expect(capitalize("mom")).toBe("Mom");
});

test("Capitalizes a mixed case word", () => {
	expect(capitalize("mOm")).toBe("Mom");
});

test("Capitalizes an uppercase word", () => {
	expect(capitalize("MOM")).toBe("Mom");
});

test("Handles an empty word", () => {
	expect(capitalize("")).toBe("");
});

test("Handles a 1 letter word", () => {
	expect(capitalize("m")).toBe("M");
});
