import { Context, TypedResponse } from "hono";
import * as LegalisirIjazahService from "$services/LegalisirIjazahService";
import { handleServiceErrorWithResponse, response_created, response_success } from "$utils/response.utils";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import { UserJWTDAO } from "$entities/User";
import { LegalisirIjazahDTO, VerifikasiLegalisirIjazahDTO, ProsesLegalisirIjazahDTO } from "$entities/LegalisirIjazah";

export async function create(c: Context): Promise<TypedResponse> {
        const data: LegalisirIjazahDTO = await c.req.json();
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await LegalisirIjazahService.create(data, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_created(c, serviceResponse.data, "Successfully created new LegalisirIjazah!");
}

export async function getAll(c: Context): Promise<TypedResponse> {
        const filters: FilteringQueryV2 = checkFilteringQueryV2(c);
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await LegalisirIjazahService.getAll(filters, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched all LegalisirIjazah!");
}

export async function getById(c: Context): Promise<TypedResponse> {
        const id = c.req.param("id");

        const serviceResponse = await LegalisirIjazahService.getById(id);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched LegalisirIjazah by id!");
}

export async function update(c: Context): Promise<TypedResponse> {
        const id = c.req.param("id");
        const data: LegalisirIjazahDTO = await c.req.json();
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await LegalisirIjazahService.update(id, data, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched LegalisirIjazah by id!");
}

export async function verification(c: Context): Promise<TypedResponse> {
        const data: VerifikasiLegalisirIjazahDTO = await c.req.json();
        const id = c.req.param("id");
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await LegalisirIjazahService.verificationStatus(id, data, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully verificated LegalisirIjazah by id!");
}

export async function prosesLegalisir(c: Context): Promise<TypedResponse> {
        const data: ProsesLegalisirIjazahDTO = await c.req.json();
        const id = c.req.param("id");
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await LegalisirIjazahService.prosesLegalisir(id, data, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully started processing LegalisirIjazah!");
}
