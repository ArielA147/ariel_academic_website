export const IS_PRODUCTION = location.hostname.includes('github.io');

export const ROOT_PATH = IS_PRODUCTION ? '/ariel_academic_website' : '/';

export const DataType = {
	JSON: 'json',
	TEXT: 'text',
	HTML: 'html',
};
