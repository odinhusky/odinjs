//
//  GlobalData.m
//  zfv2
//
//  Created by B on 2022/9/2.
//

#import "GlobalData.h"
#import "Init.h"

@implementation GlobalData

static Init* m__rd__init__;

+(Init*)f__rd__init__ {
    
    
    if(m__rd__init__ == nil) {
        m__rd__init__ = [Init new];
    }
    
    return m__rd__init__;
}

@end
