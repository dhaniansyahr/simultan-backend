import { Context, TypedResponse } from "hono";
import * as PengajuanYudisiumDTOService from "$services/PengajuanYudisiumService";
import { handleServiceErrorWithResponse, response_created, response_success } from "$utils/response.utils";
import { PengajuanYudisiumDTO, VerifikasiPengajuanYudisiumDTO } from "$entities/PengajuanYudisium";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import { UserJWTDAO } from "$entities/User";

export async function create(c: Context): Promise<TypedResponse> {
        const data: PengajuanYudisiumDTO = await c.req.json();
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await PengajuanYudisiumDTOService.create(data, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_created(c, serviceResponse.data, "Successfully created new PengajuanYudisiumDTO!");
}

export async function getAll(c: Context): Promise<TypedResponse> {
        const filters: FilteringQueryV2 = checkFilteringQueryV2(c);
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await PengajuanYudisiumDTOService.getAll(filters, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched all PengajuanYudisiumDTO!");
}

export async function getById(c: Context): Promise<TypedResponse> {
        const id = c.req.param("id");

        const serviceResponse = await PengajuanYudisiumDTOService.getById(id);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched PengajuanYudisiumDTO by id!");
}

export async function verification(c: Context): Promise<TypedResponse> {
        const data: VerifikasiPengajuanYudisiumDTO = await c.req.json();
        const id = c.req.param("id");
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await PengajuanYudisiumDTOService.verificationStatus(id, data, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully verificated PengajuanYudisiumDTO by id!");
}
