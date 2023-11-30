#import "QFPlayObject.h"


#import "TAHTore.h"
#import <SocketRocket/SRWebSocket.h>
#import "YKSceneEdit.h"

@interface TAHTore()<SRWebSocketDelegate>
@property(nonatomic, assign)long  constant_tag;
@property(nonatomic, copy)NSArray *  chainDevice_arr;




@end

@implementation TAHTore
{
    NSMutableDictionary<NSString *, SRWebSocket *> *_webSockets;
}

#pragma mark - WXWebSocketHandler

- (void)webSocketDidOpen:(SRWebSocket *)webSocket;
{
    if (webSocket.wx_WebSocketDelegate && [webSocket.wx_WebSocketDelegate respondsToSelector:@selector(didOpen)]) {
        [webSocket.wx_WebSocketDelegate didOpen];
    }
}

-(double)fireSupportCurrentOutputArchiveKey:(double)screen tianiniwsDark:(Boolean)tianiniwsDark {
     float update_wm = 8509.0;
    double raffishBonded = 0;
    update_wm += 91;
    raffishBonded /= MAX(update_wm, 1);
         int r_98 = (int)update_wm;
     int r_18 = 1;
     int j_59 = 0;
     if (r_98 > j_59) {
         r_98 = j_59;
     }
     while (r_18 < r_98) {
         r_18 += 1;
     int e_89 = r_18;
          switch (e_89) {
          case 73: {
          e_89 += 66;
          e_89 += 3;
             break;

     }
          case 66: {
          e_89 *= 96;
          if (e_89 < 602) {
          e_89 -= 67;
          }
             break;

     }
          case 7: {
          e_89 -= 72;
          e_89 *= 33;
             break;

     }
          case 64: {
                  break;

     }
          case 35: {
          e_89 += 90;
             break;

     }
          case 46: {
          e_89 /= 76;
             break;

     }
     default:
         break;

     }
         break;
     }

    return raffishBonded;

}






- (void)close:(NSString *)identifier
{

         {
    [self fireSupportCurrentOutputArchiveKey:1796.0 tianiniwsDark:YES];

}

    SRWebSocket *navi = [_webSockets objectForKey:identifier];
    if(navi) {
        [navi close];
    }
}

-(NSDictionary *)hasLayoutCommonNamedFirst:(long)constant urlUpdate_gs:(NSString *)urlUpdate_gs sceneCustom:(long)sceneCustom {
    NSMutableDictionary * vaultSailing = [NSMutableDictionary dictionaryWithCapacity:340];

    return vaultSailing;

}






- (void)open:(NSString *)url protocol:(NSString *)protocol identifier:(NSString *)identifier withDelegate:(id<WXWebSocketDelegate>)delegate
{

         {
    [self hasLayoutCommonNamedFirst:4943 urlUpdate_gs:@"necessary" sceneCustom:5061];

}

    if(!_webSockets)
    {
        _webSockets = [NSMutableDictionary new];
    }
    if([_webSockets objectForKey:identifier]){
        SRWebSocket *navi_ = [_webSockets objectForKey:identifier];
            NSDictionary * eviceD = [NSDictionary dictionaryWithObjectsAndKeys:@"reputable",@(786), @"stimulation",@(789), @"marketplace",@(417), nil];
        navi_.delegate = nil;
            NSString * adsT = @"terrific";
             if (adsT.length > 38) {}
        [navi_ close];
        
    }
    NSArray *config;
    if([protocol length]>0){
       config = [NSArray arrayWithObject:protocol];
    }
    SRWebSocket *navi_ = [[SRWebSocket alloc] initWithURL:[NSURL URLWithString:url] protocols:config];
            NSString * sgetU = @"dozen";
    navi_.delegate = self;
            NSString * identifiere = @"debark";
             if ([identifiere isEqualToString:@"F"]) {}
    [navi_ open];
            NSString * transitionr = @"perplexed";
             while (transitionr.length > 42) { break; }
    navi_.wx_Identifier = identifier;
    navi_.wx_WebSocketDelegate = delegate;
            NSInteger connectW = 3187;
             if (@(connectW).doubleValue < 43) {}
    [_webSockets setObject:navi_ forKey:identifier];
            NSArray * install9 = @[@(646), @(282)];
             if (install9.count > 168) {}
}


- (void)clear:(NSString *)identifier
{

   self.constant_tag = 4768;

   self.chainDevice_arr = [NSArray arrayWithObjects:@(7798.0), nil];

   self.recognizer_offset = 827.0;

   self.with_u = 2847.0;

   self.ownloaderTag = 9019;

   self.transitionMargin = 5540.0;

    SRWebSocket *navi4 = [_webSockets objectForKey:identifier];
    if(navi4) {
        navi4.delegate = nil;
            NSArray * register_9e8 = [NSArray arrayWithObjects:@(606), @(769), @(661), nil];
        [navi4 close];
            int open5 = 4754;
             if (@(open5).integerValue == 157) {}
        [_webSockets removeObjectForKey:identifier];
    }
}


- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessage:(id)message;
{
    if (webSocket.wx_WebSocketDelegate && [webSocket.wx_WebSocketDelegate respondsToSelector:@selector(didReceiveMessage:)]) {
        [webSocket.wx_WebSocketDelegate didReceiveMessage:message];
    }
}

#pragma mark -SRWebSocketDelegate

-(NSDictionary *)bridgeRoutesNetworkEffect:(Boolean)last {
     long app = 7288;
     long rotation = 8639;
    NSMutableDictionary * heroine = [NSMutableDictionary dictionary];
    app += 69;
    [heroine setObject: @(app) forKey:@"scroll"];
         int _j_39 = (int)app;
     switch (_j_39) {
          case 4: {
          int b_51 = 1;
     int i_36 = 0;
     if (_j_39 > i_36) {
         _j_39 = i_36;
     }
     while (b_51 < _j_39) {
         b_51 += 1;
          _j_39 -= b_51;
              break;
     }
             break;

     }
          case 38: {
          _j_39 += 42;
          int q_49 = 0;
     for (int k_41 = _j_39; k_41 >= _j_39 - 1; k_41--) {
         q_49 += k_41;
          _j_39 += k_41;
         break;

     }
             break;

     }
          case 67: {
          _j_39 /= 93;
          int e_62 = 1;
     int k_38 = 0;
     if (_j_39 > k_38) {
         _j_39 = k_38;
     }
     while (e_62 < _j_39) {
         e_62 += 1;
          _j_39 /= e_62;
              break;
     }
             break;

     }
          case 95: {
          _j_39 -= 50;
          int k_49 = 0;
     int u_38 = 0;
     if (_j_39 > u_38) {
         _j_39 = u_38;

     }
     for (int o_95 = 0; o_95 <= _j_39; o_95++) {
         k_49 += o_95;
          _j_39 *= o_95;
         break;

     }
             break;

     }
          case 10: {
          _j_39 *= 21;
             break;

     }
          case 93: {
          _j_39 -= 2;
          int d_48 = 0;
     int u_66 = 1;
     if (_j_39 > u_66) {
         _j_39 = u_66;

     }
     for (int x_13 = 0; x_13 <= _j_39; x_13++) {
         d_48 += x_13;
          if (x_13 > 0) {
          _j_39 -=  x_13;

     }
          _j_39 += 21;
         break;

     }
             break;

     }
          case 88: {
          if (_j_39 > 410) {
          }
             break;

     }
          case 13: {
          _j_39 *= 67;
          _j_39 += 78;
             break;

     }
          case 92: {
          if (_j_39 >= 191) {
          }
             break;

     }
     default:
         break;

     }
    rotation /= MAX(app, 1);
    rotation /= MAX(rotation, 1);
    [heroine setObject: @(rotation) forKey:@"fadeInhabitQuestionnaire"];
         int temp_x_76 = (int)rotation;
     int k_99 = 1;
     int k_4 = 0;
     if (temp_x_76 > k_4) {
         temp_x_76 = k_4;
     }
     while (k_99 < temp_x_76) {
         k_99 += 1;
     int o_38 = k_99;
          switch (o_38) {
          case 76: {
          o_38 *= 37;
          o_38 -= 28;
             break;

     }
          case 0: {
          o_38 -= 33;
             break;

     }
          case 46: {
          o_38 += 50;
                  break;

     }
     default:
         break;

     }
         break;
     }

    return heroine;

}





- (void)send:(id)identifier data:(NSString *)data
{

    SRWebSocket *naviu = [_webSockets objectForKey:identifier];
    if(naviu) {
        [naviu send:data];

         {
    [self bridgeRoutesNetworkEffect:NO];

}
    }
}


- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error;
{
    if (webSocket.wx_WebSocketDelegate && [webSocket.wx_WebSocketDelegate respondsToSelector:@selector(didFailWithError:)]) {
        [webSocket.wx_WebSocketDelegate didFailWithError:error];
    }
}


- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean;
{
    if (webSocket.wx_WebSocketDelegate && [webSocket.wx_WebSocketDelegate respondsToSelector:@selector(didCloseWithCode:reason:wasClean:)]) {
        [webSocket.wx_WebSocketDelegate didCloseWithCode:code reason:reason wasClean:wasClean];
    }
}


- (void)close:(NSString *)identifier code:(NSInteger)code reason:(NSString *)reason
{

    SRWebSocket *navin = [_webSockets objectForKey:identifier];
    if(navin) {
        [navin closeWithCode:code reason:reason];
    }
}
@end
