export interface UserChatProfile {}

export interface OnlineServiceProvide<T extends UserChatProfile> {
  isSupportThirdPartyChat(): boolean;

  initChat(): void;

  openChat(originalFeature: () => void): void;

  setUserChatProfile(profile: T): void;

  clearUserChatProfile(): void;
}
