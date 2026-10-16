import { z } from "zod";

import { API_PATHS } from "@shared/constants";

import { api } from "./api";

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

const UploadResponseSchema = z.object({ url: z.string() });

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(API_PATHS.UPLOAD, formData);

  return UploadResponseSchema.parse(response.data).url;
};
