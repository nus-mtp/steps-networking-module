const Paths = {
  home: '/',
  login: '/login',
  signup: '/signup',
  logout: '/logout',
  exhibition: '/exhibition/:eventName/:exhibitionName',
  event: '/event(/:eventName)',
  chat: '/chat(/:email)',
  chat_empty: '/chat',
  profile: '/profile/:email',
  match: '/match',
  search: '/search/:category(/:tags)',
};

export default Paths;
