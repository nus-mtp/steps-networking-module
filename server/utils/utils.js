/**
 * A function which removes all duplicates from a given Array.
 *
 * @param {Array} arr: The given Array to remove duplicates from.
 * @returns {Array}: A copy of the given Array that has no duplicates.
 */
function removeDuplicates(arr) {
  return Array.from(new Set(arr));
}

module.exports.removeDuplicates = removeDuplicates;
