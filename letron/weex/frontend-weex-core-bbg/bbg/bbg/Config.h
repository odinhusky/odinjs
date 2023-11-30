#import "Constant.h"

#ifndef Config_h
#define Config_h

#define DATA_INDEX [[NSBundle mainBundle] URLForResource:@"index" withExtension:@"js" subdirectory:@"data"];

#define CURRENT_IP @""
#define HOME_URL [NSURL URLWithString:[NSString stringWithFormat:@"http://", CURRENT_IP]]
#define HOT_URL [NSString stringWithFormat:@"ws://", CURRENT_IP]

#define DEBUG_URL DATA_INDEX

#endif
