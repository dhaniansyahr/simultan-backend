import { Context, TypedResponse } from "hono";
import * as SuratKeteranganKuliahService from "$services/SuratKeteranganKuliahService";
import { handleServiceErrorWithResponse, MIME_TYPE, response_buffer, response_created, response_success } from "$utils/response.utils";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import { LetterProcessDTO, SuratKeteranganKuliahDTO, VerifikasiSuratDTO } from "$entities/SuratKeteranganKuliah";
import { UserJWTDAO } from "$entities/User";

export async function create(c: Context): Promise<TypedResponse> {
        const data: SuratKeteranganKuliahDTO = await c.req.json();
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await SuratKeteranganKuliahService.create(data, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_created(c, serviceResponse.data, "Successfully created new SuratKeteranganKuliah!");
}

export async function getAll(c: Context): Promise<TypedResponse> {
        const filters: FilteringQueryV2 = checkFilteringQueryV2(c);
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await SuratKeteranganKuliahService.getAll(filters, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched all SuratKeteranganKuliah!");
}

export async function getAllHistory(c: Context): Promise<TypedResponse> {
        const filters: FilteringQueryV2 = checkFilteringQueryV2(c);
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await SuratKeteranganKuliahService.getAllHistory(filters, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully fetched all SuratKeteranganKuliah history!");
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
        const id = c.req.param("id");
        const data: SuratKeteranganKuliahDTO = await c.req.json();
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await SuratKeteranganKuliahService.update(id, data, user);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully updated SuratKeteranganKuliah!");
}

export async function verificationSurat(c: Context): Promise<Response | TypedResponse> {
        const data: VerifikasiSuratDTO = await c.req.json();
        const id = c.req.param("id");
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await SuratKeteranganKuliahService.verificationStatus(id, data, user);

        if (!serviceResponse.status) return handleServiceErrorWithResponse(c, serviceResponse);

        return response_success(c, serviceResponse.data, "Successfully verificated SuratKeteranganKuliah!");
}

export async function letterProcess(c: Context): Promise<Response | TypedResponse> {
        const data: LetterProcessDTO = await c.req.json();
        const id = c.req.param("id");
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await SuratKeteranganKuliahService.letterProcess(id, user, data);

        if (!serviceResponse.status) return handleServiceErrorWithResponse(c, serviceResponse);

        return response_success(c, serviceResponse.data, "Successfully verificated SuratKeteranganKuliah!");
}

export async function updateNomorSurat(c: Context): Promise<TypedResponse> {
        const id = c.req.param("id");
        const data: { nomorSurat: string } = await c.req.json();
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await SuratKeteranganKuliahService.updateNomorSurat(id, user, data);

        if (!serviceResponse.status) {
                return handleServiceErrorWithResponse(c, serviceResponse);
        }

        return response_success(c, serviceResponse.data, "Successfully updated nomor surat!");
}

export async function cetakSurat(c: Context): Promise<Response | TypedResponse> {
        const id = c.req.param("id");
        const user: UserJWTDAO = c.get("jwtPayload");

        const serviceResponse = await SuratKeteranganKuliahService.cetakSurat(id, user);
        if (!serviceResponse.status) return handleServiceErrorWithResponse(c, serviceResponse);

        const { buffer, fileName } = serviceResponse.data as any;

        return response_buffer(c, fileName, MIME_TYPE.PDF, buffer);
}
