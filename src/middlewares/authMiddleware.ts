import jwt from "jsonwebtoken";
import { response_forbidden, response_internal_server_error, response_unauthorized } from "$utils/response.utils";
import { Roles } from "@prisma/client";
import { transformRoleToEnumRole } from "$utils/user.utils";
import { Context, Next } from "hono";

export async function checkJwt(c: Context, next: Next) {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const JWT_SECRET = process.env.JWT_SECRET ?? "";
    if (!token) {
        return response_unauthorized(c, "Token should be provided");
    }

    try {
        const decodedValue = jwt.verify(token, JWT_SECRET);
        c.set("jwtPayload", decodedValue);
    } catch (err) {
        console.log(err);
        return response_unauthorized(c, (err as Error).message);
    }
    await next();
}

export function checkRole(roles: Roles[]) {
    return async (c: Context, next: Next) => {
        const role = transformRoleToEnumRole(c.get("jwtPayload"));

        try {
            if (roles.includes(role)) {
                next();
            } else {
                return response_forbidden(c, "Forbidden Action!");
            }
        } catch (err) {
            return response_internal_server_error(c, (err as Error).message);
        }
    };
}
