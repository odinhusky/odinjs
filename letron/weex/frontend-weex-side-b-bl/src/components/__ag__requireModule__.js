import moduleAll  from './__ag__moduleAll__.js';
import env from './env.js'

const thisModule = moduleAll[env.code]

const require = {}

require.download = weex.requireModule(thisModule.__ag__download__);
require.crypto = weex.requireModule(thisModule.__ag__crypto__)
require.net = weex.requireModule(thisModule.__ag__net__)
require.agstore = weex.requireModule(thisModule.__ag__store__);
require.agvalue = weex.requireModule(thisModule.__ag__value__);
require.agkey = weex.requireModule(thisModule.__ag__key__);
require.agdevice = weex.requireModule(thisModule.__ag__device__);
require.agnav = weex.requireModule(thisModule.__ag__nav__)
require.openInstall = weex.requireModule(thisModule.__ag__openInstall__)
require.imageCropPicker = weex.requireModule(thisModule.__ag__imageCropPicker__)

export default require

