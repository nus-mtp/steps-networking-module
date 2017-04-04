const Paths = {
  home: '/',
  login: '/login',
  signup: '/signup',
  logout: '/logout',
  exhibition: '/exhibition/:eventName/:exhibitionName',
  event: '/event/:eventName',
  event_empty: '/event',
  chat: '/chat(/:email)',
  chat_empty: '/chat',
  profile: '/profile/:email',
  profile_empty: '/profile',
  match: '/match/:email/:eventId/:reasons',
  search: '/search/:category(/:tags)',
};

export default Paths;
