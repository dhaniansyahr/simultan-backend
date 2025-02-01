import { Context, TypedResponse } from "hono";
import * as SuratKeteranganKuliahService from "$services/SuratKeteranganKuliahService";
import { handleServiceErrorWithResponse, response_created, response_success } from "$utils/response.utils";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import { SuratKeteranganKuliahDTO, VerifikasiSuratDTO } from "$entities/SuratKeteranganKuliah";
import { UserJWTDAO } from "$entities/User";

export async function create(c: Context): Promise<TypedResponse> {
    const data: SuratKeteranganKuliahDTO = await c.req.json();

    const serviceResponse = await SuratKeteranganKuliahService.create(data);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_created(c, serviceResponse.data, "Successfully created new SuratKeteranganKuliah!");
}

export async function getAll(c: Context): Promise<TypedResponse> {
    const filters: FilteringQueryV2 = checkFilteringQueryV2(c);

    const serviceResponse = await SuratKeteranganKuliahService.getAll(filters);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully fetched all SuratKeteranganKuliah!");
}

export async function getById(c: Context): Promise<TypedResponse> {
    const id = c.req.param("id");

    const serviceResponse = await SuratKeteranganKuliahService.getById(id);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully fetched SuratKeteranganKuliah by id!");
}

export async function update(c: Context): Promise<TypedResponse> {
    const data: SuratKeteranganKuliahDTO = await c.req.json();
    const id = c.req.param("id");

    const serviceResponse = await SuratKeteranganKuliahService.update(id, data);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully updated SuratKeteranganKuliah!");
}

export async function deleteByIds(c: Context): Promise<TypedResponse> {
    const ids = c.req.query("ids") as string;

    const serviceResponse = await SuratKeteranganKuliahService.deleteByIds(ids);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully deleted SuratKeteranganKuliah!");
}

export async function verificationSurat(c: Context): Promise<Response | TypedResponse> {
    const data: VerifikasiSuratDTO = await c.req.json();
    const id = c.req.param("id");
    const user: UserJWTDAO = c.get("jwtPayload");

    console.log("ID : ", id);

    const serviceResponse = await SuratKeteranganKuliahService.verificationStatus(id, data, user);

    if (!serviceResponse.status) return handleServiceErrorWithResponse(c, serviceResponse);

    return response_success(c, serviceResponse.data, "Successfully verificated SuratKeteranganKuliah!");
}
