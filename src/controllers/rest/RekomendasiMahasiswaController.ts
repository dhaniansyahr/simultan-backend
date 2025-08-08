import { Context } from "hono";
import * as RekomendasiMahasiswaService from "$services/RekomendasiMahasiswaService";
import { FilteringQueryV2 } from "$entities/Query";
import { UserJWTDAO } from "$entities/User";
import {
  RekomendasiMahasiswaDTO,
  VerifikasiRekomendasiMahasiswaDTO,
  UpdateNomorSuratRekomendasiMahasiswaDTO,
} from "$entities/RekomendasiMahasiswa";

export async function getAll(c: Context) {
  const user = c.get("user") as UserJWTDAO;
  const filters: FilteringQueryV2 = c.req.query();

  const result = await RekomendasiMahasiswaService.getAll(filters, user);

  if (!result.status) {
    return c.json(result, 400);
  }

  return c.json(result, 200);
}

export async function create(c: Context) {
  const user = c.get("user") as UserJWTDAO;
  const data: RekomendasiMahasiswaDTO = await c.req.json();

  const result = await RekomendasiMahasiswaService.create(data, user);

  if (!result.status) {
    return c.json(result, 400);
  }

  return c.json(result, 201);
}

export async function getById(c: Context) {
  const id = c.req.param("id");
  const user = c.get("user") as UserJWTDAO;

  const result = await RekomendasiMahasiswaService.getById(id, user);

  if (!result.status) {
    return c.json(result, 400);
  }

  return c.json(result, 200);
}

export async function update(c: Context) {
  const id = c.req.param("id");
  const user = c.get("user") as UserJWTDAO;
  const data: RekomendasiMahasiswaDTO = await c.req.json();

  const result = await RekomendasiMahasiswaService.update(id, data, user);

  if (!result.status) {
    return c.json(result, 400);
  }

  return c.json(result, 200);
}

export async function verification(c: Context) {
  const id = c.req.param("id");
  const user = c.get("user") as UserJWTDAO;
  const data: VerifikasiRekomendasiMahasiswaDTO = await c.req.json();

  const result = await RekomendasiMahasiswaService.verification(id, data, user);

  if (!result.status) {
    return c.json(result, 400);
  }

  return c.json(result, 200);
}

export async function updateNomorSurat(c: Context) {
  const id = c.req.param("id");
  const user = c.get("user") as UserJWTDAO;
  const data: UpdateNomorSuratRekomendasiMahasiswaDTO = await c.req.json();

  const result = await RekomendasiMahasiswaService.updateNomorSurat(
    id,
    data,
    user
  );

  if (!result.status) {
    return c.json(result, 400);
  }

  return c.json(result, 200);
}
