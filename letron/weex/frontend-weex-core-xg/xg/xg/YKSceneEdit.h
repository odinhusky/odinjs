


#import <SocketRocket/SRWebSocket.h>
#import <WeexSDK/WXWebSocketHandler.h>
#import <objc/runtime.h>

@interface SRWebSocket (Weex)

@property (nonatomic, copy) NSString *wx_Identifier;
@property (nonatomic, weak) id<WXWebSocketDelegate> wx_WebSocketDelegate;



@end
