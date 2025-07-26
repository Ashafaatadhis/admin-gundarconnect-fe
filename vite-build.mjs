import { createHash } from "crypto";

globalThis.crypto ??= {};
globalThis.crypto.subtle ??= {
  digest: async (algorithm, data) => {
    const hash = createHash(algorithm.toLowerCase());
    hash.update(Buffer.from(data));
    return hash.digest();
  },
};

import { build } from "vite";

build();
