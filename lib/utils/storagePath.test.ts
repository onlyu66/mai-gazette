import assert from "node:assert/strict";
import test from "node:test";

import { extractStoragePathFromUrl } from "./storagePath.ts";

test("extracts a public storage path from a Supabase storage URL", () => {
  const result = extractStoragePathFromUrl(
    "https://example.supabase.co/storage/v1/object/public/images/graduate-hero.png",
  );

  assert.deepEqual(result, {
    bucket: "images",
    objectPath: "graduate-hero.png",
  });
});

test("extracts a public path from a legacy public URL", () => {
  const result = extractStoragePathFromUrl(
    "https://example.supabase.co/public/images/graduate-hero.png",
  );

  assert.deepEqual(result, {
    bucket: "images",
    objectPath: "graduate-hero.png",
  });
});
