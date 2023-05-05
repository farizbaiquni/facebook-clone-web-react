export type headerPostType = {
  username: string;
  createdAt: Date | null;
  accessType: string;
};

export type reactPostsType = {
  like: Set<string>;
  love: Set<string>;
  care: Set<string>;
  haha: Set<string>;
  wow: Set<string>;
  sad: Set<string>;
  angry: Set<string>;
};
