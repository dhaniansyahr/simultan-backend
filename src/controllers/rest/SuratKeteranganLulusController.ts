import { Context, TypedResponse } from "hono";
import * as SuratKeteranganLulusService from "$services/SuratKeteranganLulusService";
import { handleServiceErrorWithResponse, response_created, response_success } from "$utils/response.utils";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import {
    SuratKeteranganLulusDTO,
    VerifikasiSuratKeteranganLulusDTO,
    UpdateNomorSuratSuratKeteranganLulusDTO,
} from "$entities/SuratKeteranganLulus";
import { UserJWTDAO } from "$entities/User";
import { LetterProcessDTO } from "$entities/SuratKeteranganKuliah";


export async function getAll(c: Context): Promise<TypedResponse> {
    const filters: FilteringQueryV2 = checkFilteringQueryV2(c);
    const user: UserJWTDAO = c.get("jwtPayload");

    const serviceResponse = await SuratKeteranganLulusService.getAll(filters, user);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully fetched all SuratKeteranganLulus!");
}

export async function create(c: Context): Promise<TypedResponse> {
    const data: SuratKeteranganLulusDTO = await c.req.json();
    const user: UserJWTDAO = c.get("jwtPayload");

    const serviceResponse = await SuratKeteranganLulusService.create(data, user);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_created(c, serviceResponse.data, "Successfully created new SuratKeteranganLulus!");
}

export async function getAllHistory(c: Context): Promise<TypedResponse> {
    const filters: FilteringQueryV2 = checkFilteringQueryV2(c);
    const user: UserJWTDAO = c.get("jwtPayload");

    const serviceResponse = await SuratKeteranganLulusService.getAllHistory(filters, user);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully fetched all SuratKeteranganLulus history!");
}

export async function getById(c: Context): Promise<TypedResponse> {
    const id = c.req.param("id");
    const user: UserJWTDAO = c.get("jwtPayload");

    const serviceResponse = await SuratKeteranganLulusService.getById(id, user);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully fetched SuratKeteranganLulus by id!");
}

export async function update(c: Context): Promise<TypedResponse> {
    const id = c.req.param("id");
    const data: SuratKeteranganLulusDTO = await c.req.json();
    const user: UserJWTDAO = c.get("jwtPayload");

    const serviceResponse = await SuratKeteranganLulusService.update(id, data, user);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully updated SuratKeteranganLulus!");
}

export async function verification(c: Context): Promise<TypedResponse> {
    const id = c.req.param("id");
    const data: VerifikasiSuratKeteranganLulusDTO = await c.req.json();
    const user: UserJWTDAO = c.get("jwtPayload");

    const serviceResponse = await SuratKeteranganLulusService.verificationStatus(id, data, user);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully verified SuratKeteranganLulus!");
}

export async function letterProcess(c: Context): Promise<Response | TypedResponse> {
        const data: LetterProcessDTO = await c.req.json();
        const id = c.req.param("id");
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await SuratKeteranganLulusService.letterProcess(id, user, data);

        if (!serviceResponse.status) return handleServiceErrorWithResponse(c, serviceResponse);

        return response_success(c, serviceResponse.data, "Successfully verificated SuratKeteranganLulus!");
}

export async function updateNomorSurat(c: Context): Promise<TypedResponse> {
    const id = c.req.param("id");
    const data: UpdateNomorSuratSuratKeteranganLulusDTO = await c.req.json();
    const user: UserJWTDAO = c.get("jwtPayload");

    const serviceResponse = await SuratKeteranganLulusService.updateNomorSurat(id, data, user);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse);
    }

    return response_success(c, serviceResponse.data, "Successfully updated nomor surat!");
}
