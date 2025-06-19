import { Context, TypedResponse } from "hono";
import * as AksesLevelService from "$services/AksesLevelService";
import { handleServiceErrorWithResponse, response_created, response_success } from "$utils/response.utils";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import { AksesLevelDTO } from "$entities/AksesLevel";

export async function create(c: Context): Promise<TypedResponse> {
        const data: AksesLevelDTO = await c.req.json();

        const serviceResponse = await AksesLevelService.create(data);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_created(c, serviceResponse.data, "Successfully created new UserLevel!");
}

export async function getAll(c: Context): Promise<TypedResponse> {
        const filters: FilteringQueryV2 = checkFilteringQueryV2(c);

        const serviceResponse = await AksesLevelService.getAll(filters);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched all UserLevel!");
}

export async function getById(c: Context): Promise<TypedResponse> {
        const id = c.req.param("id");

        const serviceResponse = await AksesLevelService.getById(Number(id));

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched indikator kerja by id!");
}

export async function update(c: Context): Promise<TypedResponse> {
        const data: AksesLevelDTO = await c.req.json();
        const id = c.req.param("id");

        const serviceResponse = await AksesLevelService.update(Number(id), data);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully updated UserLevel!");
}

export async function deleteByIds(c: Context): Promise<TypedResponse> {
        const ids = c.req.query("ids") as string;

        const serviceResponse = await AksesLevelService.deleteByIds(ids);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully deleted UserLevel!");
}
