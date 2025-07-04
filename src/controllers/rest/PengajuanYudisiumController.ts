import { Context, TypedResponse } from "hono";
import * as PengajuanYudisiumService from "$services/PengajuanYudisiumService";
import { handleServiceErrorWithResponse, MIME_TYPE, response_buffer, response_created, response_success } from "$utils/response.utils";
import { PengajuanYudisiumDTO, VerifikasiPengajuanYudisiumDTO } from "$entities/PengajuanYudisium";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import { UserJWTDAO } from "$entities/User";

export async function create(c: Context): Promise<TypedResponse> {
        const data: PengajuanYudisiumDTO = await c.req.json();
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await PengajuanYudisiumService.create(data, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_created(c, serviceResponse.data, "Successfully created new PengajuanYudisiumDTO!");
}

export async function getAll(c: Context): Promise<TypedResponse> {
        const filters: FilteringQueryV2 = checkFilteringQueryV2(c);
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await PengajuanYudisiumService.getAll(filters, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched all PengajuanYudisiumDTO!");
}

export async function getById(c: Context): Promise<TypedResponse> {
        const id = c.req.param("id");

        const serviceResponse = await PengajuanYudisiumService.getById(id);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched PengajuanYudisiumDTO by id!");
}

export async function update(c: Context): Promise<TypedResponse> {
        const id = c.req.param("id");
        const data: PengajuanYudisiumDTO = await c.req.json();
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await PengajuanYudisiumService.update(id, data, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched PengajuanYudisiumDTO by id!");
}

export async function verification(c: Context): Promise<TypedResponse> {
        const data: VerifikasiPengajuanYudisiumDTO = await c.req.json();
        const id = c.req.param("id");
        const user: UserJWTDAO = c.get("jwtPayload");

        console.log("Masuk Controller Yudis : ");
        const serviceResponse = await PengajuanYudisiumService.verificationStatus(id, data, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully verificated PengajuanYudisiumDTO by id!");
}

export async function cetakSurat(c: Context): Promise<Response | TypedResponse> {
        const id = c.req.param("id");
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await PengajuanYudisiumService.cetakSurat(id, user);
        if (!serviceResponse.status) return handleServiceErrorWithResponse(c, serviceResponse);

        const { buffer, fileName } = serviceResponse.data as any;

        return response_buffer(c, fileName, MIME_TYPE.PDF, buffer);
}
