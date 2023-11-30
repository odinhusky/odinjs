	import __ag__util from "./util.js"
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			__ag__url__(url) {
				return __ag__util.url(url)
			},
      staticPath(fileName) {
        let middlePath = ''
        const extension = fileName.split('.')[1];

        switch (extension) {
          case 'jpeg':
          case 'png':
          case 'gif':
            middlePath = 'img'
            break;
          case 'html':
            middlePath = 'page'
            break;
        }
        
        return `./static/${middlePath}/${fileName}`
			}
		}
	}