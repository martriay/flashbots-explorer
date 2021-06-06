export function getSubBundles(bundle) { 
  return bundle.transactions.reduce((acc, curr) => {
    if (acc[curr.bundle_index]) {
      acc[curr.bundle_index].push(curr);
    } else {
      acc[curr.bundle_index] = [curr];
    }
    return acc;
  }, []);
}

export function transformBundle(bundle) {
  bundle.transactions = getSubBundles(bundle);
  return bundle;
}
