

#import "WXCryptoModule.h"
#import <CommonCrypto/CommonHMAC.h>

@implementation WXCryptoModule
    
WX_EXPORT_METHOD_SYNC(@selector(f__rd__hmacSha256__:secret:))

-(NSString*)f__rd__hmacSha256__:(NSString *)data secret:(NSString *)secret{

    NSString *result = [WXCryptoModule encodeHmacSha256:data secret:secret];

    return result;

}


+(NSString*)encodeHmacSha256:(NSString*)data secret:(NSString*)secret{
    
    
    const char *cKey = [secret cStringUsingEncoding:NSASCIIStringEncoding];
     const char *cData = [data cStringUsingEncoding:NSASCIIStringEncoding];
     unsigned char cHMAC[CC_SHA256_DIGEST_LENGTH];
     CCHmac(kCCHmacAlgSHA256, cKey, strlen(cKey), cData, strlen(cData), cHMAC);
     NSData *hash = [[NSData alloc] initWithBytes:cHMAC length:sizeof(cHMAC)];

     NSLog(@"%@", hash);

     NSString* s = [WXCryptoModule base64forData:hash];
     NSLog(@"result = %@", s);
    
    return s;
}

+ (NSString*)base64forData:(NSData*)theData {
 const uint8_t* input = (const uint8_t*)[theData bytes];
 NSInteger length = [theData length];

 static char table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

 NSMutableData* data = [NSMutableData dataWithLength:((length + 2) / 3) * 4];
 uint8_t* output = (uint8_t*)data.mutableBytes;

 NSInteger i;
 for (i=0; i < length; i += 3) {
 NSInteger value = 0;
 NSInteger j;
 for (j = i; j < (i + 3); j++) {
 value <<= 8;

 if (j < length) {  value |= (0xFF & input[j]);  }  }  NSInteger theIndex = (i / 3) * 4;  output[theIndex + 0] = table[(value >> 18) & 0x3F];
 output[theIndex + 1] = table[(value >> 12) & 0x3F];
 output[theIndex + 2] = (i + 1) < length ? table[(value >> 6) & 0x3F] : '=';
 output[theIndex + 3] = (i + 2) < length ? table[(value >> 0) & 0x3F] : '=';
 }

 return [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding]; }

    
    
@end
