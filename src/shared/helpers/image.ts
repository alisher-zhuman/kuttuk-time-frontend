// Logos are Cloudinary uploads of up to 5 MB. Ask Cloudinary for a square crop
// at 2× the displayed size (retina), in the best format the browser takes
// (f_auto) and quality (q_auto). Anything not on Cloudinary is left as is.
export const logoUrl = (url: string, px: number) => {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;

  const size = px * 2;

  return url.replace("/upload/", `/upload/c_fill,w_${size},h_${size},f_auto,q_auto/`);
};
