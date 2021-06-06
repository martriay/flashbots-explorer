import { transformBundle } from "./transformBundle";

export const API_URL = 'https://blocks.flashbots.net/v1/blocks';

export async function getBlocks(params: Record<string, string> = {}) {
  params.limit = '10';
  const url = `${API_URL}/?${new URLSearchParams(params)}`;
  const res = await fetch(url);
  const { blocks } = await res.json();
  return blocks.map(block => transformBundle(block));
}
