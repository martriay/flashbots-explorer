export const API_URL = 'https://blocks.flashbots.net/v1/blocks';

export async function getBlocks(params: Record<string, string> = {}) {
  params.limit = '10';
  const url = `${API_URL}/?${new URLSearchParams(params)}`;
  const res = await fetch(url);
  const { blocks } = await res.json();
  return Object.keys(blocks).map(blockNumber => transformBundle(blocks[blockNumber]));
}

function getSubBundles(bundle) {
  return bundle.transactions.reduce((acc, curr) => {
    if (acc[curr.bundle_index]) {
      acc[curr.bundle_index].push(curr);
    } else {
      acc[curr.bundle_index] = [curr];
    }
    return acc;
  }, []);
}

function transformBundle(bundle) {
  bundle.transactions = getSubBundles(bundle);
  return bundle;
}
