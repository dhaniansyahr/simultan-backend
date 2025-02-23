import { AclCreateDTO } from "$entities/Acl";
import { Context, TypedResponse } from "hono";
import * as AclService from "$services/AclService";
import { handleServiceErrorWithResponse, response_success } from "$utils/response.utils";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import { FilteringQueryV2 } from "$entities/Query";

export async function create(c: Context): Promise<TypedResponse> {
    const data: AclCreateDTO = await c.req.json();

    const serviceResponse = await AclService.create(data);

    if (!serviceResponse.status) {
        handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully create Acl By User Level");
}

export async function getByUserLevelId(c: Context): Promise<TypedResponse> {
    const aksesLevelId = c.req.param("aksesLevelId");

    const serviceResponse = await AclService.getByAksesLevelId(Number(aksesLevelId));

    if (!serviceResponse.status) {
        handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully get Acl By User Level");
}

export async function getAllFeatures(c: Context): Promise<TypedResponse> {
    const serviceResponse = await AclService.getAllFeature();

    if (!serviceResponse.status) {
        handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully get all features");
}

export async function getAllLevelAkses(c: Context): Promise<TypedResponse> {
    const filters: FilteringQueryV2 = checkFilteringQueryV2(c);

    const serviceResponse = await AclService.getAllAksesLevel(filters);

    if (!serviceResponse.status) {
        handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully get all features");
}
