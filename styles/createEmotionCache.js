import Buffer from "react";
import createCache from "@emotion/cache";
import uuidv4 from "uuid/v4";

const nonce = new Buffer(uuidv4()).toString("base64");

const isBrowser = typeof document !== "undefined";

export default function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector(
      'meta[name="emotion-insertion-point"]'
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({
    key: "mui-style",
    insertionPoint,
    nonce: nonce,
    prepend: true,
  });
}
