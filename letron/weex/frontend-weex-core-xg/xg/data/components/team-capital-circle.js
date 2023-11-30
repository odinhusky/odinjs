// { "framework": "Vue"} 

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 321);
/******/ })
/************************************************************************/
/******/ ({

/***/ 321:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _teamCapitalCircle = __webpack_require__(34);

var _teamCapitalCircle2 = _interopRequireDefault(_teamCapitalCircle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_teamCapitalCircle2.default.el = '#root';
new Vue(_teamCapitalCircle2.default);

/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(35)
)

/* script */
__vue_exports__ = __webpack_require__(36)

/* template */
var __vue_template__ = __webpack_require__(37)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/odin/Letron/Projects/frontend-weex-side-a/src/components/team-capital-circle.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-e987cc36"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),

/***/ 35:
/***/ (function(module, exports) {

module.exports = {
  "teamCircleBg": {
    "borderRadius": 50,
    "position": "relative",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "white-border": {
    "borderWidth": "3",
    "borderColor": "#ffffff",
    "borderRadius": 50,
    "top": "5",
    "left": "5",
    "position": "absolute",
    "zIndex": 2
  },
  "capital-text": {
    "color": "#ffffff",
    "fontWeight": "bold"
  }
}

/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  name: "team-capital-circle",
  props: {
    size: {
      type: Number,
      required: true
    },
    team: {
      type: String,
      default: "a"
    },
    capital: {
      type: String,
      required: true
    },
    fontSize: {
      type: Number
    }
  }
};

/***/ }),

/***/ 37:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["teamCircleBg"],
    style: {
      backgroundColor: _vm.team === 'a' ? '#ba0303' : '#2758a7',
      width: (_vm.size + "px"),
      height: (_vm.size + "px"),
    }
  }, [_c('div', {
    staticClass: ["white-border"],
    style: {
      width: ((_vm.size - 10) + "px"),
      height: ((_vm.size - 10) + "px"),
    }
  }), _c('text', {
    staticClass: ["capital-text"],
    style: {
      fontSize: _vm.fontSize ? (_vm.fontSize + "px") : ((_vm.size / 2) + "px"),
    }
  }, [_vm._v(_vm._s(_vm.capital))])])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ })

/******/ });