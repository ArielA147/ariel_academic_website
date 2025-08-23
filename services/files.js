const ALLOWED_FILE_FORMATS = [
	'.pdf',
	'.htm',
	'.html',
	'.ppt',
	'.pptx',
	'.xls',
	'.xlsx',
	'.doc',
	'.docx',
	'.txt',
];

/**
 * @param {string} fileName
 */
export function isFileFormat(fileName) {
	fileName = fileName.toLowerCase();

	return ALLOWED_FILE_FORMATS.some((format) => fileName.endsWith(format));
}
