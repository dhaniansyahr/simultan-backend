import { Context, TypedResponse } from "hono";
import * as MenuService from "$services/MenuService";
import { handleServiceErrorWithResponse, response_created, response_success } from "$utils/response.utils";
import { MenuDTO } from "$entities/Menu";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";

export async function create(c: Context): Promise<TypedResponse> {
        const data: MenuDTO = await c.req.json();

        const serviceResponse = await MenuService.create(data);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_created(c, serviceResponse.data, "Successfully created new Menu!");
}

export async function getAll(c: Context): Promise<TypedResponse> {
        const filters: FilteringQueryV2 = checkFilteringQueryV2(c);

        const serviceResponse = await MenuService.getAll(filters);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched all Menu!");
}

export async function getById(c: Context): Promise<TypedResponse> {
        const id = c.req.param("id");

        const serviceResponse = await MenuService.getById(Number(id));

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched Menu by id!");
}

export async function update(c: Context): Promise<TypedResponse> {
        const data: MenuDTO = await c.req.json();
        const id = c.req.param("id");

        const serviceResponse = await MenuService.update(Number(id), data);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully updated Menu!");
}
