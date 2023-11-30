
#import "SRWebSocket+Weex.h"
static char wx_IdentifierKey;
static char wx_WebSocketDelegateKey;


@implementation SRWebSocket (Weex)

-(void)setWxIdentifier:(NSString *)wx_Identifier
{
    objc_setAssociatedObject(self, &wx_IdentifierKey, wx_Identifier, OBJC_ASSOCIATION_COPY);
}

-(NSString *)wxIdentifier
{
    return objc_getAssociatedObject(self, &wx_IdentifierKey);
}

-(void)setWx_WebSocketDelegate:(id<WXWebSocketDelegate>)wx_WebSocketDelegate
{
    objc_setAssociatedObject(self, &wx_WebSocketDelegateKey, wx_WebSocketDelegate, OBJC_ASSOCIATION_COPY);
}

-(NSString *)wx_WebSocketDelegate
{
    return objc_getAssociatedObject(self, &wx_WebSocketDelegateKey);
}

@end
