import { Context, TypedResponse } from "hono";
import * as CutiSementaraService from "$services/CutiSementaraService";
import { handleServiceErrorWithResponse, response_created, response_success } from "$utils/response.utils";
import { CutiSementaraDTO } from "$entities/CutiSementara";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import { UserJWTDAO } from "$entities/User";

export async function create(c: Context): Promise<TypedResponse> {
    const data: CutiSementaraDTO = await c.req.json();
    const user: UserJWTDAO = c.get("jwtPayload");

    const serviceResponse = await CutiSementaraService.create(data, user);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_created(c, serviceResponse.data, "Successfully created new CutiSementara!");
}

export async function getAll(c: Context): Promise<TypedResponse> {
    const filters: FilteringQueryV2 = checkFilteringQueryV2(c);

    const serviceResponse = await CutiSementaraService.getAll(filters);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully fetched all CutiSementara!");
}

export async function getById(c: Context): Promise<TypedResponse> {
    const id = c.req.param("id");

    const serviceResponse = await CutiSementaraService.getById(id);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully fetched CutiSementara by id!");
}

export async function update(c: Context): Promise<TypedResponse> {
    const data: CutiSementaraDTO = await c.req.json();
    const id = c.req.param("id");

    const serviceResponse = await CutiSementaraService.update(id, data);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully updated CutiSementara!");
}

export async function deleteByIds(c: Context): Promise<TypedResponse> {
    const ids = c.req.query("ids") as string;

    const serviceResponse = await CutiSementaraService.deleteByIds(ids);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully deleted CutiSementara!");
}
