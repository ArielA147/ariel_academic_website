export const IS_PRODUCTION = location.hostname.includes('github.io');

export const ROOT_PATH = IS_PRODUCTION ? '/ariel_academic_website' : '/';

export const DataType = {
	JSON: 'json',
	TEXT: 'text',
	HTML: 'html',
};

export const JSON_DATA_FOLDER = 'data/jsons';

export const JSON_FILE_PATHS = {
	LECTURER_INFO_JSON: `${JSON_DATA_FOLDER}/lecturer.json`,
	GENERAL_INFO_JSON: `${JSON_DATA_FOLDER}/general-info.json`,
	RESOURCES_JSON: `${JSON_DATA_FOLDER}/resources.json`,
	BLOG_JSON: `${JSON_DATA_FOLDER}/blog.json`,
	NEXT_BLOG_JSON: `${JSON_DATA_FOLDER}/next_blog.json`,
	PUBLICATIONS_JSON: `${JSON_DATA_FOLDER}/academic-publications.json`,
	RESEARCH_JSON: `${JSON_DATA_FOLDER}/research.json`,
};
