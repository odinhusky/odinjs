import moduleAll  from './__ag__moduleAll__.js';
import env from './env.js'

const module = moduleAll[env.code]

const require = {}

require.download = weex.requireModule(module.__ag__download__);
require.crypto = weex.requireModule(module.__ag__crypto__)
require.net = weex.requireModule(module.__ag__net__)
require.agstore = weex.requireModule(module.__ag__store__);
require.agvalue = weex.requireModule(module.__ag__value__);
require.agkey = weex.requireModule(module.__ag__key__);
require.agdevice = weex.requireModule(module.__ag__device__);
require.agnav = weex.requireModule(module.__ag__nav__)
require.openInstall = weex.requireModule(module.__ag__openInstall__)
require.imageCropPicker = weex.requireModule(module.__ag__imageCropPicker__)

export default require

