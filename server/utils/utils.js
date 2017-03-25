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
 * Extracts out the relevant information from a supplied User Object.
 *
 * @param {User.Object} user: The User Object returned from a User objectClass method.
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
 * Extracts out the relevant information from a supplied Event Object.
 *
 * @param {Event.Object} event: The Event Object returned from a Event objectClass method.
 * @returns {{id, name, start_date: (*|Date|eventSchema.start_date|{type, default}), end_date: (*|Date|eventSchema.end_date|{type, default}), venue: (*|string|String), description: (string|*|string|string|string|String), event_poster: (*|String|string|string), siteMap, tags}}
 */
function extractEventInfo(event) {
  return {
    id: event._id,
    name: event.event_name,
    start_date: event.start_date,
    end_date: event.end_date,
    venue: event.event_location,
    description: event.event_description,
    event_poster: event.event_picture,
    siteMap: event.event_map,
    tags: event.tags,
  };
}

module.exports.extractEventInfo = extractEventInfo;

/**
 * Extracts out relevant information from a supplied Exhibition Object.
 *
 * @param {Exhibition.Object} exhibition:
 *    The Exhibition Object returned from a Exhibition objectClass method.
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

/**
 * Extracts out relevant information from a supplied Attendance Object.
 *
 * @param {Attendance.Object} attendance:
 *    The Attendance Object returned from a Attendance objectClass method.
 * @returns {{id, userEmail, attendanceType: (attendanceSchema.attendance_type|{type, enum, default}|string|string|String), attendanceKey: (number|mongoose.Schema.ObjectId|attendanceSchema.attendance_key|{type, required}|*), reasons}}
 */
function extractAttendanceInfo(attendance) {
  return {
    id: attendance._id,
    userEmail: attendance.user_email,
    attendanceType: attendance.attendance_type,
    attendanceKey: attendance.attendance_key,
    reasons: attendance.reason,
  };
}

module.exports.extractAttendanceInfo = extractAttendanceInfo;

/**
 * Extracts out relevant information from a supplied Comment Object.
 *
 * @param {Comment.Object} comment:
 *    The Comment Object returned from a Comment objectClass method.
 * @returns {{id, userEmail, comments}}
 */
function extractCommentInfo(comment) {
  return {
    id: comment._id,
    userEmail: comment.user_email,
    comments: comment.comments,
  };
}

module.exports.extractCommentInfo = extractCommentInfo;
