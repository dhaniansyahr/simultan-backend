import { Context, TypedResponse } from "hono";
import * as RekomendasiBeasiswaService from "$services/RekomendasiBeasiswaService";
import { handleServiceErrorWithResponse, response_success, response_created, response_buffer, MIME_TYPE } from "$utils/response.utils";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import { UserJWTDAO } from "$entities/User";
import {
  RekomendasiBeasiswaDTO,
  VerifikasiRekomendasiBeasiswaDTO,
} from "$entities/RekomendasiBeasiswa";
import { LetterProcessDTO } from "$entities/SuratKeteranganKuliah";

export async function getAll(c: Context): Promise<TypedResponse> {
  const filters: FilteringQueryV2 = checkFilteringQueryV2(c);
  const user: UserJWTDAO = c.get("jwtPayload");

  const serviceResponse = await RekomendasiBeasiswaService.getAll(filters, user);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(c, serviceResponse.data, "Successfully fetched all RekomendasiBeasiswa!");
}

export async function getAllHistory(c: Context): Promise<TypedResponse> {
  const filters: FilteringQueryV2 = checkFilteringQueryV2(c);
  const user: UserJWTDAO = c.get("jwtPayload");

  const serviceResponse = await RekomendasiBeasiswaService.getAllHistory(filters, user);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(c, serviceResponse.data, "Successfully fetched all RekomendasiBeasiswa history!");
}

export async function create(c: Context): Promise<TypedResponse> {
  const data: RekomendasiBeasiswaDTO = await c.req.json();
  const user: UserJWTDAO = c.get("jwtPayload");

  const serviceResponse = await RekomendasiBeasiswaService.create(data, user);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_created(c, serviceResponse.data, "Successfully created new RekomendasiBeasiswa!");
}

export async function getById(c: Context): Promise<TypedResponse> {
  const id = c.req.param("id");
  const user: UserJWTDAO = c.get("jwtPayload");

  const serviceResponse = await RekomendasiBeasiswaService.getById(id, user);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(c, serviceResponse.data, "Successfully fetched RekomendasiBeasiswa by id!");
}

export async function update(c: Context): Promise<TypedResponse> {
  const id = c.req.param("id");
  const data: RekomendasiBeasiswaDTO = await c.req.json();
  const user: UserJWTDAO = c.get("jwtPayload");

  const serviceResponse = await RekomendasiBeasiswaService.update(id, data, user);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(c, serviceResponse.data, "Successfully updated RekomendasiBeasiswa!");
}

export async function verification(c: Context): Promise<TypedResponse> {
  const id = c.req.param("id");
  const data: VerifikasiRekomendasiBeasiswaDTO = await c.req.json();
  const user: UserJWTDAO = c.get("jwtPayload");

  const serviceResponse = await RekomendasiBeasiswaService.verificationStatus(id, data, user);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(c, serviceResponse.data, "Successfully verified RekomendasiBeasiswa!");
}

export async function cetakSurat(c: Context): Promise<Response | TypedResponse> {
  const id = c.req.param("id");
  const user: UserJWTDAO = c.get("jwtPayload");

  const serviceResponse = await RekomendasiBeasiswaService.cetakSurat(id, user);
  if (!serviceResponse.status) return handleServiceErrorWithResponse(c, serviceResponse);

  const { buffer, fileName } = serviceResponse.data as { buffer: Buffer; fileName: string };

  // Assuming you have response_buffer and MIME_TYPE.PDF imported/utilized
  return response_buffer(c, fileName, MIME_TYPE.PDF, buffer);
}

export async function processLetter(c: Context): Promise<TypedResponse> {
  const id = c.req.param("id");
  const data: LetterProcessDTO = await c.req.json();
  const user: UserJWTDAO = c.get("jwtPayload");

  const serviceResponse = await RekomendasiBeasiswaService.letterProcess(id, user, data);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(c, serviceResponse.data, "Successfully processed RekomendasiBeasiswa letter!");
}

export async function updateNomorSurat(c: Context): Promise<TypedResponse> {
  const id = c.req.param("id");
  const data: { nomorSurat: string } = await c.req.json();
  const user: UserJWTDAO = c.get("jwtPayload");

  const serviceResponse = await RekomendasiBeasiswaService.updateNomorSurat(id, user, data);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(c, serviceResponse.data, "Successfully updated nomor surat for RekomendasiBeasiswa!");
}
