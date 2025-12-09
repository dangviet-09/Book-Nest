import { ERole } from "../../generated/prisma/index.js";

class ERoleSingleton {
  static #instance = null; // Private singleton instance
  #role = null; // Current role

  constructor(roleName) {
    if (ERoleSingleton.#instance) {
      throw new Error("Use ERoleSingleton.getInstance()");
    }

    this.setRole(roleName); // Validate and assign role
    ERoleSingleton.#instance = this;
  }

  static getInstance(roleName) {
    if (!ERoleSingleton.#instance) {
      ERoleSingleton.#instance = new ERoleSingleton(roleName);
    } else if (roleName) {
      ERoleSingleton.#instance.setRole(roleName); // Optional: allow updating role
    }

    return ERoleSingleton.#instance;
  }

  static reset() {
    ERoleSingleton.#instance = null;
  }

  getRole() {
    return this.#role;
  }

  setRole(roleName) {
    if (!ERole[roleName]) {
      throw new Error(`Invalid role: ${roleName}`);
    }
    this.#role = ERole[roleName];
  }
}

export default ERoleSingleton;
