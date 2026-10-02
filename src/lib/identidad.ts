/**
 * Trabajadores sin correo electrónico.
 *
 * En obra, planta o campo muchos trabajadores no tienen correo. Su cuenta se
 * identifica con el número de documento: el sistema le asigna una dirección
 * interna bajo el dominio reservado ".invalid" (RFC 2606, nunca recibe correo)
 * y el trabajador ingresa escribiendo su documento en lugar del correo.
 * Sin correo real no hay recuperación por código: su empresa le restablece
 * la contraseña.
 *
 * Sin dependencias de servidor: lo usan también los componentes del navegador.
 */
export const DOMINIO_SIN_CORREO = "sin-correo.invalid";

/**
 * Validación de correo idéntica en el navegador y en el servidor (la misma
 * expresión que usa zod), para que la vista previa no muestre como "Lista" una
 * fila que el servidor va a rechazar.
 */
const CORREO = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;
export const esCorreoValido = (correo: string) => CORREO.test(correo);

/** Documento sin puntos, espacios ni guiones (1.098.765.432 → 1098765432). */
export const normalizarDocumento = (documento: string) => documento.replace(/[.\s-]/g, "").toUpperCase();

export const correoInterno = (documento: string) =>
  `doc.${normalizarDocumento(documento).toLowerCase()}@${DOMINIO_SIN_CORREO}`;

export const tieneCorreoReal = (email: string) => !email.toLowerCase().endsWith(`@${DOMINIO_SIN_CORREO}`);

/** Lo que se muestra en pantalla y en los reportes en lugar del correo interno. */
export const correoVisible = (email: string) => (tieneCorreoReal(email) ? email : "Sin correo");

/** Con qué ingresa la persona: su correo o, si no tiene, su documento. */
export const usuarioDeIngreso = (u: { email: string; documentNumber?: string | null }) =>
  tieneCorreoReal(u.email) ? u.email : (u.documentNumber ?? u.email);
