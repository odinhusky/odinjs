#import "Constant.h"

#ifndef Config_h
#define Config_h

#define DATA_INDEX [[NSBundle mainBundle] URLForResource:@"index" withExtension:@"js" subdirectory:@"data"];

#define CURRENT_IP @"10.0.0.20"
#define HOME_URL [NSURL URLWithString:[NSString stringWithFormat:@"http://%@:8081/dist/index.js", CURRENT_IP]]
#define HOT_URL [NSString stringWithFormat:@"ws://%@:8082/", CURRENT_IP]

#define DEBUG_URL HOME_URL

#endif