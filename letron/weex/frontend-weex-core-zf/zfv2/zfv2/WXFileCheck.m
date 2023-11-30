
#import "WXFileCheck.h"
#import <CommonCrypto/CommonDigest.h>

@implementation WXFileCheck

// MD5 hash for file 对文件进行MD5 HASH计算
- (NSString * _Nullable)md5HashForFileWithFullPath:(NSString *)fullPath {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    // Make sure the file exists
    if( [fileManager fileExistsAtPath:fullPath isDirectory:nil]) {
        NSData *data = [NSData dataWithContentsOfFile:fullPath];
        unsigned char digest[CC_MD5_DIGEST_LENGTH];
        CC_MD5(data.bytes, (CC_LONG)data.length, digest);
 
        NSMutableString *output = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
        for(int i = 0; i < CC_MD5_DIGEST_LENGTH; i++) {
            [output appendFormat:@"%02x", digest[i]];
        }
        return output;
    }
    return nil;
}

// 对文件进行SHA256 HASH计算
- (NSString * _Nullable)sha256HashForFileWithFullPath:(NSString *)fullPath {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    // Make sure the file exists
    if( [fileManager fileExistsAtPath:fullPath isDirectory:nil] ) {
        NSData *data = [NSData dataWithContentsOfFile:fullPath];
        unsigned char digest[CC_SHA256_DIGEST_LENGTH];
        CC_SHA256(data.bytes, (CC_LONG)data.length, digest);
 
        NSMutableString *output = [NSMutableString stringWithCapacity:CC_SHA256_DIGEST_LENGTH * 2];
 
        for (int i = 0; i < CC_SHA256_DIGEST_LENGTH; i++) {
            [output appendFormat:@"%02x", digest[i]];
        }
        return output;
    }
    return nil;
}

@end
