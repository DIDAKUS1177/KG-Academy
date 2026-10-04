/**
 * Llamadas del navegador a la API de la plataforma.
 *
 * Una ruta que exige sesión responde con una redirección a /ingresar cuando la
 * sesión venció. fetch la sigue sola y termina en la página de ingreso (200,
 * HTML): sin este control, un formulario creía que había guardado. Aquí se
 * reconoce ese caso y cualquier respuesta que no sea JSON, y se devuelve un
 * error claro en lugar de un éxito falso.
 */
export const SESION_VENCIDA =
  "Su sesión venció. Ingrese de nuevo (puede hacerlo en otra pestaña) y vuelva a intentarlo: esta acción no se guardó.";

export type RespuestaApi<T> = { ok: boolean; status: number; data: T & { error?: string } };

export async function pedirApi<T = Record<string, unknown>>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
): Promise<RespuestaApi<T>> {
  const fallo = (status: number, error: string): RespuestaApi<T> => ({ ok: false, status, data: { error } as T & { error?: string } });
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    return fallo(0, "Sin conexión con el servidor. Revise su internet y vuelva a intentarlo.");
  }
  if (res.redirected) {
    return res.url.includes("/cambiar-clave")
      ? fallo(403, "Debe cambiar su contraseña antes de continuar. Recargue la página.")
      : fallo(401, SESION_VENCIDA);
  }
  if (!(res.headers.get("content-type") ?? "").includes("application/json")) {
    return fallo(res.status || 500, "Respuesta inesperada del servidor. Vuelva a intentarlo en un momento.");
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  return { ok: res.ok, status: res.status, data };
}
