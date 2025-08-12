import { Context, TypedResponse } from "hono";
import * as RekomendasiBeasiswaService from "$services/RekomendasiBeasiswaService";
import { handleServiceErrorWithResponse, response_success, response_created } from "$utils/response.utils";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import { UserJWTDAO } from "$entities/User";
import {
  RekomendasiBeasiswaDTO,
  VerifikasiRekomendasiBeasiswaDTO,
} from "$entities/RekomendasiBeasiswa";

export async function getAll(c: Context): Promise<TypedResponse> {
  const filters: FilteringQueryV2 = checkFilteringQueryV2(c);
  const user: UserJWTDAO = c.get("jwtPayload");

  const serviceResponse = await RekomendasiBeasiswaService.getAll(filters, user);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(c, serviceResponse.data, "Successfully fetched all RekomendasiBeasiswa!");
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
