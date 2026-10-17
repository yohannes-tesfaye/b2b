import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  product: ["create", "read", "update", "delete"],
  order: ["create", "read", "update", "cancel"],
} as const;

export const ac = createAccessControl(statement);

export const supplier = ac.newRole({
  product: ["create", "read", "update", "delete"],
  order: ["read", "update"],
});

export const buyer = ac.newRole({
  product: ["read"],
  order: ["create", "read", "cancel"],
});

export const tradeServiceProvider = ac.newRole({
  product: ["read"],
  order: ["read", "update"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  product: ["read", "update", "delete"],
  order: ["read", "update", "cancel"],
});

export const superadmin = ac.newRole({
  ...adminAc.statements,
  product: ["create", "read", "update", "delete"],
  order: ["create", "read", "update", "cancel"],
});

export const roles = {
  supplier,
  buyer,
  "trade-service-provider": tradeServiceProvider,
  admin,
  superadmin,
};

export const adminRoles = ["admin", "superadmin"];
