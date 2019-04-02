export async function get(fn: string, path: string, opts: any): Promise<any>;
export async function get(fn: string, path: string, opts: any): Promise<any>;
export async function put(fn: string, path: string, opts: any): Promise<any>;
export async function putAsync(fn: string, path: string, opts: any): Promise<void>;
export async function patch(fn: string, path: string, opts: any): Promise<any>;
export async function patchAsync(fn: string, path: string, opts: any): Promise<void>;
export async function post(fn: string, path: string, opts: any): Promise<any>;
export async function postAsync(fn: string, path: string, opts: any): Promise<void>;
// TODO: shuold be delete
export async function del(fn: string, path: string, opts: any): Promise<any>;
export async function delAsync(fn: string, path: string, opts: any): Promise<void>;
