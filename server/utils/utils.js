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

/**
 * Extracts out the relevant information from a supplied User document.
 *
 * @param {Mongoose.Document} user: The User document returned from a User objectClass method.
 * @returns {{id, userEmail: *, userProfile: (*|String|string), userName: *, userDescription: *, userSkills: (*|Array|skills|{$regex}), bookmarkedUsers: (*|Array)}}
 */
function extractUserInfo(user) {
  return {
    id: user._id,
    userEmail: user.email,
    userProfilePicture: user.profile_picture,
    userName: user.name,
    userDescription: user.description,
    userSkills: user.skills,
    bookmarkedUsers: user.bookmarked_users,
    userNotification: user.will_notify,
    isDeleted: user.is_deleted,
  };
}

module.exports.extractUserInfo = extractUserInfo;

/**
 * Extracts out relevant information from a supplied Exhibition Document.
 *
 * @param {Mongoose.Document} exhibition:
 *    The Exhibition document returned from a Exhibition objectClass method.
 * @returns {{id, exhibitionName, exhibitionDescription: (*|string|String|string), eventName, website: (*|String), poster: (*|number|String|string), images: (*|Array|HTMLCollection), videos: (*|Array), tags}}
 */
function extractExhibitionInfo(exhibition) {
  return {
    id: exhibition._id,
    exhibitionName: exhibition.exhibition_name,
    exhibitionDescription: exhibition.exhibition_description,
    eventName: exhibition.event_name,
    website: exhibition.website,
    poster: exhibition.poster,
    images: exhibition.images,
    videos: exhibition.videos,
    tags: exhibition.tags,
  };
}

module.exports.extractExhibitionInfo = extractExhibitionInfo;
