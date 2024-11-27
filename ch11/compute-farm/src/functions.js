function subsetSum(set, sum) {
  const subsets = [];

  function findSubsets(set, subset, sum) {
    for (let i = 0; i < set.length; i++) {
      const newSubset = subset.concat(set[i]);

      findSubsets(set.slice(i + 1), newSubset, sum);

      const result = newSubset.reduce(
        (prev, item) => prev + item, 0);
      if (result === sum) subsets.push(newSubset);
    }
  }

  findSubsets(set, [], sum);

  return subsets;
}

export default { subsetSum };
